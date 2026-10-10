const News = require('../models/News');

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
    // Retorna status 500 asegurando responder JSON con headers
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
      titulo,
      subtitulo: subtitulo || '',
      contenidoMarkdown: contenidoMarkdown || '',
      categoria: categoria ? categoria.toUpperCase().trim() : 'GENERAL',
      imagenPrincipal: imagenPrincipal.trim(),
      galeria: galeria || [],
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