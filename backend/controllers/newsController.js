const News = require('../models/News');

// Helper para sanitizar y limpiar nombres de archivos/rutas (elimina acentos, 'ñ', espacios y caracteres especiales)
// Helper definitivo para limpiar nombres y rutas de archivos para Supabase Storage
const sanitizarNombreImagen = (nombreArchivo) => {
  if (!nombreArchivo || typeof nombreArchivo !== 'string') return '';

  // 1. Decodificar posibles secuencias de caracteres URL/UTF-8 corruptas (ej: %C3%B1 o ÃƒÂ±)
  let textoLimpio = nombreArchivo;
  try {
    textoLimpio = decodeURIComponent(nombreArchivo);
  } catch (e) {
    // Si falla la decodificación URI, se mantiene el string original
  }

  // 2. Extraer directorio (si existe) y nombre del archivo
  const partes = textoLimpio.split('/');
  const nombreReal = partes.pop();
  const directorio = partes.join('/');

  // 3. Separar nombre de la extensión para evitar extensiones dobles (ej: .jpg.png)
  const ultimoPunto = nombreReal.lastIndexOf('.');
  let nombreSinExt = nombreReal;
  let extension = '';

  if (ultimoPunto !== -1) {
    nombreSinExt = nombreReal.substring(0, ultimoPunto);
    extension = nombreReal.substring(ultimoPunto).toLowerCase();
    
    // Limpiar extensiones compuestas raros (ej: .jpg.png -> .png)
    extension = extension.replace(/[^a-z0-9.]/g, '');
  }

  // 4. Sanitizar el cuerpo del nombre (elimina tildes, ñ/Ñ, mojibake y caracteres raros)
  const cuerpoClean = nombreSinExt
    .normalize('NFD')                         // Separa caracteres base de tildes/diacríticos
    .replace(/[\u0300-\u036f]/g, '')          // Elimina tildes y acentos
    .replace(/[ñÑ]/g, 'n')                    // Reemplaza 'ñ' / 'Ñ' por 'n'
    .replace(/[^a-zA-Z0-9_-]/g, '_')          // Reemplaza todo lo que NO sea alfanumérico por '_'
    .replace(/_+/g, '_')                      // Evita guiones bajos repetidos (___)
    .replace(/^_+|_+$/g, '');                 // Quita guiones bajos al inicio o al final

  // 5. Reconstruir nombre seguro
  const archivoFinal = `${cuerpoClean || 'imagen'}${extension}`;

  // 6. Si tenía carpeta previa (ej: "general/"), la conserva
  return directorio ? `${directorio}/${archivoFinal}` : archivoFinal;
};

// 1. GET: Obtener noticias de un municipio específico
const getNewsByMunicipio = async (req, res) => {
  try {
    const { municipio } = req.query;

    if (!municipio) {
      return res.status(400).json({ error: 'Debes especificar el parámetro municipio' });
    }

    // Sanitización segura del string
    const municipioClean = String(municipio).trim();

    // Filtro flexible compatible con insensible a mayúsculas/minúsculas
    const queryFilter = {
      $and: [
        {
          $or: [
            { municipio: { $regex: new RegExp(`^${municipioClean}$`, 'i') } },
            { municipioId: { $regex: new RegExp(`^${municipioClean}$`, 'i') } }
          ]
        },
        { publicado: { $ne: false,$ne: 0 } }
      ]
    };

    const news = await News.find(queryFilter)
      .select('idOriginal titulo subtitulo imagenPrincipal categoria municipio municipioId publicado fechaPublicacion createdAt galeria videos')
      .sort({ fechaPublicacion: -1, createdAt: -1, _id: -1 })
      .lean();

    if (req.headers['x-legacy-response'] === 'true') {
      return res.json(news);
    }

    return res.json({
      total: news.length,
      data: news
    });
  } catch (error) {
    console.error('❌ Error en getNewsByMunicipio:', error);
    return res.status(500).json({ 
      error: 'Error interno al consultar las noticias',
      message: error.message 
    });
  }
};

// 2. GET: Obtener una noticia por su ID (_id de MongoDB)
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const newsItem = await News.findById(id);
    if (!newsItem || newsItem.publicado === false || newsItem.publicado === 0) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    // Incrementa contador de vistas en segundo plano
    News.findByIdAndUpdate(id, { $inc: { vistas: 1 } }).catch(() => {});

    return res.json(newsItem);
  } catch (error) {
    console.error('Error al obtener detalle de la noticia:', error);
    return res.status(500).json({ error: 'Error al consultar la noticia' });
  }
};

// 3. POST: Crear una nueva noticia (Ruta Privada)
const createNews = async (req, res) => {
  try {
    const {
      municipio,
      municipioId,
      titulo,
      subtitulo,
      contenidoMarkdown,
      categoria,
      imagenPrincipal,
      galeria,
      videos,
      destacada,
      publicado,
      fechaPublicacion
    } = req.body;

    const targetMunicipio = (municipio || municipioId || '').toLowerCase().trim();

    if (!titulo || !targetMunicipio) {
      return res.status(400).json({ error: 'El título y municipio son obligatorios' });
    }

    // Requisito obligatorio: Portada requerida
    if (!imagenPrincipal || !imagenPrincipal.trim()) {
      return res.status(400).json({ error: 'La imagen de portada es obligatoria' });
    }

    // Sanitización y parche del nombre de imagen principal
    const imagenPrincipalLimpia = sanitizarNombreImagen(imagenPrincipal.trim());

    // Sanitización opcional de las imágenes en galería si se envían
    const galeriaLimpia = Array.isArray(galeria)
      ? galeria.map((img) => (typeof img === 'string' ? sanitizarNombreImagen(img.trim()) : img))
      : [];

    // Normalización de municipio del usuario
    const userMunicipio = req.user?.municipioAsignado ? req.user.municipioAsignado.toLowerCase().trim() : '';

    // Validación de permisos según rol
    if (req.user && req.user.rol !== 'SUPER_ADMIN' && targetMunicipio !== userMunicipio) {
      return res.status(403).json({
        error: `No tenés permisos para publicar noticias en el municipio '${targetMunicipio}'`
      });
    }

    const newNews = new News({
      idOriginal: `manual-${Date.now()}`,
      municipio: targetMunicipio,
      municipioId: targetMunicipio,
      titulo: titulo.trim(),
      subtitulo: subtitulo ? subtitulo.trim() : '',
      contenidoMarkdown: contenidoMarkdown || '',
      categoria: categoria ? categoria.toUpperCase().trim() : 'GENERAL',
      imagenPrincipal: imagenPrincipalLimpia,
      galeria: galeriaLimpia,
      videos: videos || [],
      destacada: destacada || false,
      publicado: publicado !== undefined ? publicado : true,
      autor: req.user ? req.user.id : null,
      fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : new Date()
    });

    const savedNews = await newNews.save();

    return res.status(201).json({
      mensaje: 'Noticia creada con éxito',
      data: savedNews
    });
  } catch (error) {
    console.error('Error al crear noticia:', error);
    return res.status(500).json({ error: 'Error al guardar la noticia', detalle: error.message });
  }
};


// 4. PUT: Actualizar/Editar una noticia existente (Ruta Privada)
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    const currentMunicipio = newsItem.municipio || newsItem.municipioId;

    if (req.user && req.user.rol !== 'SUPER_ADMIN' && currentMunicipio?.toLowerCase() !== req.user.municipioAsignado?.toLowerCase()) {
      return res.status(403).json({ error: 'No tenés permisos para modificar esta noticia' });
    }

    const updateData = { ...req.body };

    // Validar portada obligatoria si la actualizan
    if (updateData.imagenPrincipal !== undefined && (!updateData.imagenPrincipal || !updateData.imagenPrincipal.trim())) {
      return res.status(400).json({ error: 'La imagen de portada no puede estar vacía' });
    }

    // Sanitizar el nombre/ruta de la imagen si fue provista
    // En updateNews (o createNews):
    if (updateData.imagenPrincipal && typeof updateData.imagenPrincipal === 'string') {
      updateData.imagenPrincipal = sanitizarNombreImagen(updateData.imagenPrincipal.trim());
    }

    if (updateData.municipio || updateData.municipioId) {
      const cleanMun = (updateData.municipio || updateData.municipioId).toLowerCase().trim();
      updateData.municipio = cleanMun;
      updateData.municipioId = cleanMun;
    }

    if (updateData.categoria) {
      updateData.categoria = updateData.categoria.toUpperCase().trim();
    }

    // Asegurar mapeo explícito de contenidoMarkdown
    if (updateData.contenidoMarkdown !== undefined) {
      updateData.contenidoMarkdown = updateData.contenidoMarkdown;
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.json({
      mensaje: 'Noticia actualizada correctamente',
      data: updatedNews
    });
  } catch (error) {
    console.error('Error al actualizar la noticia:', error);
    return res.status(500).json({ error: 'Error interno al actualizar la noticia', detalle: error.message });
  }
};

// 5. DELETE: Baja lógica de una noticia (Ruta Privada)
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    const currentMunicipio = newsItem.municipio || newsItem.municipioId;

    if (req.user && req.user.rol !== 'SUPER_ADMIN' && currentMunicipio?.toLowerCase() !== req.user.municipioAsignado?.toLowerCase()) {
      return res.status(403).json({ error: 'No tenés permisos para eliminar esta noticia' });
    }

    // BAJA LÓGICA: Se marca publicado como false/0 en lugar de eliminar el registro
    newsItem.publicado = false;
    await newsItem.save();

    return res.json({ mensaje: 'Noticia dada de baja correctamente (Baja Lógica)' });
  } catch (error) {
    console.error('Error al dar de baja la noticia:', error);
    return res.status(500).json({ error: 'Error interno al eliminar la noticia' });
  }
};

module.exports = {
  getNewsByMunicipio,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};