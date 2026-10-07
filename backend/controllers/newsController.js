const News = require('../models/News');

// GET /api/news?municipio=corrientes&categoria=CULTURA&search=obra
exports.getNewsByMunicipio = async (req, res) => {
  try {
    const { municipio, categoria, search, limit = 20, page = 1 } = req.query;

    if (!municipio) {
      return res.status(400).json({ error: 'El parámetro municipio es obligatorio' });
    }

    const filter = { municipioId: municipio.toLowerCase(), publicado: true };

    if (categoria && categoria !== 'Todas') {
      filter.categoria = new RegExp(`^${categoria}$`, 'i');
    }

    if (search) {
      filter.$or = [
        { titulo: new RegExp(search, 'i') },
        { subtitulo: new RegExp(search, 'i') }
      ];
    }

    const newsList = await News.find(filter)
      .sort({ fechaPublicacion: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await News.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: newsList
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las noticias' });
  }
};

// GET /api/news/:id
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la noticia' });
  }
};

// POST /api/news (Solo para Administradores/Prensa autenticados)
exports.createNews = async (req, res) => {
  try {
    const { municipioId, titulo, subtitulo, contenidoMarkdown, categoria, imagenPrincipal, galeria, videos, destacada } = req.body;

    // Validación de rol
    if (req.user.rol !== 'SUPER_ADMIN' && req.user.municipioAsignado !== municipioId) {
      return res.status(403).json({ error: 'No tienes permiso para publicar en este municipio' });
    }

    const newNews = new News({
      municipioId: municipioId.toLowerCase(),
      titulo,
      subtitulo,
      contenidoMarkdown,
      categoria,
      imagenPrincipal,
      galeria,
      videos,
      destacada
    });

    await newNews.save();
    res.status(201).json({ message: 'Noticia creada con éxito', data: newNews });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la noticia' });
  }
};