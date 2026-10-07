const express = require('express');
const router = express.Router();
const { 
  getNewsByMunicipio, 
  getNewsById, 
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const verifyToken = require('../middlewares/authMiddleware');

// Rutas Públicas (Usadas por las 12 webs)
router.get('/', getNewsByMunicipio);
router.get('/:id', getNewsById);

// Rutas Privadas (Usadas por el Panel CRUD)
router.post('/', verifyToken, createNews);
router.put('/:id', verifyToken, updateNews);
router.delete('/:id', verifyToken, deleteNews);

module.exports = router;