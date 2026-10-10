const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  municipio: { 
    type: String, 
    required: true, 
    lowercase: true,
    trim: true,
    index: true 
  },
  idOriginal: { type: String }, // Para mantener referencia a IDs estáticos anteriores
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  contenidoMarkdown: { type: String, default: '' }, // Opcional para evitar bloqueos si no hay MD cargado
  categoria: { type: String, required: true, uppercase: true, trim: true },
  imagenPrincipal: { type: String, default: '' },
  galeria: [{ type: String }],
  videos: [{
    url: { type: String },
    titulo: { type: String }
  }],
  vistas: { type: Number, default: 0 },
  destacada: { type: Boolean, default: false },
  publicado: { type: Boolean, default: true, index: true },
  fechaPublicacion: { type: Date, default: Date.now, index: -1 }
}, { 
  timestamps: true,
  collection: 'news' // <-- Forzar el nombre de la colección exacta en MongoDB Atlas
});

// Índice compuesto para velocidad en las consultas del NewsList
NewsSchema.index({ municipio: 1, publicado: 1, fechaPublicacion: -1 });

module.exports = mongoose.model('News', NewsSchema);