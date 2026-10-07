const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register (Para crear usuarios administradores o redactores)
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol, municipioAsignado } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'EDITOR_MUNICIPIO',
      municipioAsignado: municipioAsignado ? municipioAsignado.toLowerCase() : null
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Payload con los datos clave del usuario
    const payload = {
      id: user._id,
      nombre: user.nombre,
      rol: user.rol,
      municipioAsignado: user.municipioAsignado
    };

    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'secretkey', 
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        municipioAsignado: user.municipioAsignado
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor durante el login' });
  }
};