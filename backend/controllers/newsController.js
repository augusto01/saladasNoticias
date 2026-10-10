const News = require('../models/News');

// 1. GET: Obtener noticias de un municipio específico
const getNewsByMunicipio = async (req, res) => {
  try {
    const { municipio } = req.query;

    if (!municipio) {
      return res.status(400).json({ error: 'Debes especificar el parámetro municipio (slug o id)' });
    }

    const municipioClean = municipio.toString().trim();

    // Filtra por municipio (coincidencia flexible e insensible a mayúsculas/minúsculas)
    // Soporta tanto si en la BD el campo se llama "municipio" o "municipioId"
    const queryFilter = {
      $and: [
        {
          $or: [
            { municipio: { $regex: new RegExp(`^${municipioClean}$`, 'i') } },
            { municipioId: { $regex: new RegExp(`^${municipioClean}$`, 'i') } }
          ]
        },
        { publicado: { $ne: false } } // Devuelve noticias marcadas como true o sin el flag explícito
      ]
    };

    const news = await News.find(queryFilter)
      .select('idOriginal titulo subtitulo imagenPrincipal categoria municipio municipioId publicado fechaPublicacion createdAt galeria videos')
      .sort({ fechaPublicacion: -1, createdAt: -1, _id: -1 })
      .lean();

    // Compatibilidad en caso de que el frontend requiera array directo
    if (req.headers['x-legacy-response'] === 'true') {
      return res.json(news);
    }

    return res.json({
      total: news.length,
      data: news
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return res.status(500).json({ error: 'Error al consultar las noticias' });
  }
};

// 2. GET: Obtener una noticia por su ID (_id de MongoDB)
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const newsItem = await News.findById(id);
    if (!newsItem) {
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

    // Validación de permisos según el rol del usuario autenticado por JWT
    if (req.user && req.user.rol !== 'SUPER_ADMIN' && targetMunicipio !== req.user.municipioAsignado?.toLowerCase()) {
      return res.status(403).json({
        error: `No tenés permisos para publicar noticias en el municipio '${targetMunicipio}'`
      });
    }

    const newNews = new News({
      municipio: targetMunicipio,
      municipioId: targetMunicipio, // Guarda en ambos campos para mantener consistencia
      titulo,
      subtitulo: subtitulo || '',
      contenidoMarkdown: contenidoMarkdown || '',
      categoria: categoria ? categoria.toUpperCase().trim() : 'GENERAL',
      imagenPrincipal: imagenPrincipal || '',
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
    return res.status(500).json({ error: 'Error al guardar la noticia' });
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

    // Control de acceso por rol
    if (req.user && req.user.rol !== 'SUPER_ADMIN' && currentMunicipio?.toLowerCase() !== req.user.municipioAsignado?.toLowerCase()) {
      return res.status(403).json({ error: 'No tenés permisos para modificar esta noticia' });
    }

    const updateData = { ...req.body };
    if (updateData.municipio || updateData.municipioId) {
      const cleanMun = (updateData.municipio || updateData.municipioId).toLowerCase().trim();
      updateData.municipio = cleanMun;
      updateData.municipioId = cleanMun;
    }
    if (updateData.categoria) {
      updateData.categoria = updateData.categoria.toUpperCase().trim();
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
    return res.status(500).json({ error: 'Error interno al actualizar la noticia' });
  }
};

// 5. DELETE: Eliminar una noticia (Ruta Privada)
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    const currentMunicipio = newsItem.municipio || newsItem.municipioId;

    // Control de acceso por rol
    if (req.user && req.user.rol !== 'SUPER_ADMIN' && currentMunicipio?.toLowerCase() !== req.user.municipioAsignado?.toLowerCase()) {
      return res.status(403).json({ error: 'No tenés permisos para eliminar esta noticia' });
    }

    await News.findByIdAndDelete(id);

    return res.json({ mensaje: 'Noticia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la noticia:', error);
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