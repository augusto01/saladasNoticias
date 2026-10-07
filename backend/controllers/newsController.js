const News = require('../models/News');

// 1. GET: Obtener todas las noticias de un municipio específico
const getNewsByMunicipio = async (req, res) => {
  try {
    const { municipio } = req.query;

    if (!municipio) {
      return res.status(400).json({ error: 'Debes especificar el parámetro municipio (slug o id)' });
    }

    // Busca las noticias correspondientes al municipio ordenadas de más reciente a más antigua
    const news = await News.find({ municipioId: municipio }).sort({ createdAt: -1 });

    res.json({
      total: news.length,
      data: news
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al consultar las noticias' });
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

    res.json(newsItem);
  } catch (error) {
    console.error('Error al obtener detalle de la noticia:', error);
    res.status(500).json({ error: 'Error al consultar la noticia' });
  }
};

// 3. POST: Crear una nueva noticia (Ruta Privada)
const createNews = async (req, res) => {
  try {
    const {
      municipioId,
      titulo,
      subtitulo,
      contenidoMarkdown,
      categoria,
      imagenPrincipal,
      galeria,
      videos,
      destacada,
      publicado
    } = req.body;

    // Validación de permisos según el rol del usuario autenticado por JWT
    if (req.user.rol !== 'SUPER_ADMIN' && municipioId !== req.user.municipioAsignado) {
      return res.status(403).json({
        error: `No tenés permisos para publicar noticias en el municipio '${municipioId}'`
      });
    }

    if (!titulo || !contenidoMarkdown || !municipioId) {
      return res.status(400).json({ error: 'El título, contenido y municipio son obligatorios' });
    }

    const newNews = new News({
      municipioId,
      titulo,
      subtitulo: subtitulo || '',
      contenidoMarkdown,
      categoria: categoria ? categoria.toUpperCase() : 'GESTIÓN',
      imagenPrincipal: imagenPrincipal || '',
      galeria: galeria || [],
      videos: videos || [],
      destacada: destacada || false,
      publicado: publicado !== undefined ? publicado : true,
      autor: req.user.id,
      fechaPublicacion: new Date()
    });

    const savedNews = await newNews.save();

    res.status(201).json({
      mensaje: 'Noticia creada con éxito',
      data: savedNews
    });
  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.status(500).json({ error: 'Error al guardar la noticia' });
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

    // Control de acceso por rol
    if (req.user.rol !== 'SUPER_ADMIN' && newsItem.municipioId !== req.user.municipioAsignado) {
      return res.status(403).json({ error: 'No tenés permisos para modificar esta noticia' });
    }

    // Actualiza la noticia y la marca de tiempo updatedAt
    const updatedNews = await News.findByIdAndUpdate(
      id,
      { 
        ...req.body, 
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );

    res.json({
      mensaje: 'Noticia actualizada correctamente',
      data: updatedNews
    });
  } catch (error) {
    console.error('Error al actualizar la noticia:', error);
    res.status(500).json({ error: 'Error interno al actualizar la noticia' });
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

    // Control de acceso por rol
    if (req.user.rol !== 'SUPER_ADMIN' && newsItem.municipioId !== req.user.municipioAsignado) {
      return res.status(403).json({ error: 'No tenés permisos para eliminar esta noticia' });
    }

    await News.findByIdAndDelete(id);

    res.json({ mensaje: 'Noticia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la noticia:', error);
    res.status(500).json({ error: 'Error interno al eliminar la noticia' });
  }
};

module.exports = {
  getNewsByMunicipio,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};