const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// Registro
router.post('/register', register);

// Login
router.post('/login', login);
router.post('/logout', authController.logout);

// Logout (Usamos la función desestructurada 'logout' en lugar de 'authController.logout')
router.post('/logout', logout);

module.exports = router;