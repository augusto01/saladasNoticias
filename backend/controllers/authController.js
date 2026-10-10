const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol, municipioAsignado } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Generar el salt y el hash con bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      nombre,
      email: cleanEmail,
      password: hashedPassword,
      rol: rol || 'EDITOR_MUNICIPIO',
      municipioAsignado: municipioAsignado ? municipioAsignado.toLowerCase() : null
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
  }
};


// logout
exports.logout = async (req, res) => {
  try {
    // Si manejás cookies de sesión
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });

    return res.status(200).json({
      status: 'success',
      message: 'Sesión cerrada correctamente'
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return res.status(500).json({
      error: 'Ocurrió un error al cerrar la sesión'
    });
  }};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';



    const user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      console.log('❌ FALLO: El usuario NO existe en la base de datos activa');
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }


    // Comparar la contraseña ingresada con el hash guardado
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('3. Resultado bcrypt.compare:', isMatch);

    if (!isMatch) {
      console.log('❌ FALLO: La contraseña ingresada no coincide con el hash guardado');
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

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

    console.log('✅ LOGIN EXITOSO');

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
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor durante el login' });
  }
};