const express = require('express');
const router = express.Router();
const { 
  getNewsByMunicipio, 
  getNewsById, 
  createNews 
} = require('../controllers/newsController');
const verifyToken = require('../middlewares/authMiddleware');

// Rutas Públicas (Usadas por las 12 webs)
router.get('/', getNewsByMunicipio);
router.get('/:id', getNewsById);

// Rutas Privadas (Usadas por el Panel CRUD)
router.post('/', verifyToken, createNews);

module.exports = router;