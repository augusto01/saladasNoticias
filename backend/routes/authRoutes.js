const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// Log Middleware para ver peticiones entrantes
router.use((req, res, next) => {
  console.log(`[AUTH ROUTE] ${req.method} ${req.originalUrl}`);
  next();
});

router.post('/register', register);
router.post('/login', login);

// Ruta de Logout
router.post('/logout', (req, res, next) => {
  console.log('👉 Petición de /logout recibida en authRoutes');
  logout(req, res, next);
});

module.exports = router;