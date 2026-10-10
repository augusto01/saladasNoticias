const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { register, login, logout } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');



// Registro (Podemos protegerlo más adelante solo para SUPER_ADMIN)
router.post('/register', register);

// Login
router.post('/login', login);

module.exports = router;