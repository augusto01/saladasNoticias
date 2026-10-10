const mongoose = require('mongoose');

const MunicipioSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  slogan: { type: String, default: '' },
  saludo: { type: String, default: 'COMUNICADO OFICIAL' },
  descripcion: { type: String, default: '' },
  logoUrl: { type: String, required: true },
  colorPrimario: { type: String, default: '#0284c7' },
  colorSecundario: { type: String, default: '#0f172a' },
  layoutType: { type: String, default: 'layout_moderno' },
  headerType: { type: String, default: 'header_inline' },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Municipio', MunicipioSchema);