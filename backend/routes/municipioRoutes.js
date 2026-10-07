const express = require('express');
const router = express.Router();
const {
  getMunicipios,
  getMunicipioBySlug,
  createMunicipio,
  updateMunicipio
} = require('../controllers/municipioController');
const verifyToken = require('../middlewares/authMiddleware');

// Rutas Públicas (Los frontends consultan su configuración e identidad visual)
router.get('/', getMunicipios);
router.get('/:slug', getMunicipioBySlug);

// Rutas Privadas (Solo desde el CRUD con token JWT)
router.post('/', verifyToken, createMunicipio);
router.put('/:slug', verifyToken, updateMunicipio);

module.exports = router;