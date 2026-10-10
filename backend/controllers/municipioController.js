const Municipio = require('../models/Municipio');

// GET /api/municipios (Obtener todos los municipios activos)
exports.getMunicipios = async (req, res) => {
  try {
    const municipios = await Municipio.find({ activo: true }).sort({ nombre: 1 });
    res.json(municipios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de municipios' });
  }
};

// GET /api/municipios/:slug (Obtener configuración de un municipio por su slug)
exports.getMunicipioBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const municipio = await Municipio.findOne({ slug: slug.toLowerCase(), activo: true });

    if (!municipio) {
      return res.status(404).json({ error: 'Municipio no encontrado o inactivo' });
    }

    res.json(municipio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos del municipio' });
  }
};

// POST /api/municipios (Crear/Registrar un nuevo municipio)
exports.createMunicipio = async (req, res) => {
  try {
    const { slug, nombre, slogan, saludo, descripcion, logoUrl, colorPrimario, colorSecundario, layoutType, headerType } = req.body;

    const existingSlug = await Municipio.findOne({ slug: slug.toLowerCase() });
    if (existingSlug) {
      return res.status(400).json({ error: 'Ya existe un municipio registrado con ese slug' });
    }

    const newMunicipio = new Municipio({
      slug: slug.toLowerCase(),
      nombre,
      slogan,
      saludo,
      descripcion,
      logoUrl,
      colorPrimario,
      colorSecundario,
      layoutType,
      headerType
    });

    await newMunicipio.save();
    res.status(201).json({ message: 'Municipio creado con éxito', data: newMunicipio });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el municipio' });
  }
};

// PUT /api/municipios/:slug (Actualizar configuración o tema de un municipio)
exports.updateMunicipio = async (req, res) => {
  try {
    const { slug } = req.params;

    const updatedMunicipio = await Municipio.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMunicipio) {
      return res.status(404).json({ error: 'Municipio no encontrado' });
    }

    res.json({ message: 'Municipio actualizado correctamente', data: updatedMunicipio });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el municipio' });
  }
};