const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  rol: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'EDITOR_MUNICIPIO'], 
    default: 'EDITOR_MUNICIPIO' 
  },
  municipioAsignado: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);