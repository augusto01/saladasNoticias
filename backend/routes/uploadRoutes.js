const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const verifyToken = require('../middlewares/authMiddleware');
const { uploadToSupabase } = require('../config/supabase');

// POST /api/upload (Sube una imagen y retorna la URL pública de Supabase)
router.post('/', verifyToken, upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha adjuntado ningún archivo de imagen' });
    }

    const folder = req.body.municipioId ? `news_${req.body.municipioId}` : 'general';

    const publicUrl = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    res.status(201).json({
      message: 'Imagen subida correctamente a Supabase',
      url: publicUrl
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la imagen' });
  }
});

module.exports = router;