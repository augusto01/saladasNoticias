const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  municipioId: { 
    type: String, 
    required: true, 
    index: true 
  },
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  contenidoMarkdown: { type: String, required: true },
  categoria: { type: String, required: true },
  imagenPrincipal: { type: String, required: true },
  galeria: [{ type: String }],
  videos: [{
    url: { type: String },
    titulo: { type: String }
  }],
  destacada: { type: Boolean, default: false },
  publicado: { type: Boolean, default: true },
  fechaPublicacion: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('News', NewsSchema);