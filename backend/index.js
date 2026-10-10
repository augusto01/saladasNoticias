const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Conectar a la Base de Datos (MongoDB Atlas)
connectDB();

// Configuración de CORS Dinámica (Garantiza que saladasnoticias.com y cualquier origen reciban headers válidos sin error 500)
// Configuración de CORS Dinámica
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().replace(/\/$/, '')) 
  : [
      'https://saladasnoticias.com', 
      'https://primiciasituzaingo.com',
      'https://santarosanoticias.com',
      'https://enfoquecorrientes.com',
      'https://seguitucorrientes.netlify.app',
      'http://localhost:5173', 
      'http://localhost:3000'
    ];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const originLimpio = origin.trim().replace(/\/$/, '');

    if (
      allowedOrigins.includes('*') || 
      allowedOrigins.includes(originLimpio) ||
      originLimpio.endsWith('.netlify.app')
    ) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Expresión regular compatible para peticiones Preflight
app.options(/(.*)/, cors());



// Middlewares para parsear el cuerpo de las peticiones HTTP
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Importación y Registro de Rutas
const newsRoutes = require('./routes/newsRoutes');

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/noticias', newsRoutes);
app.use('/api/news', newsRoutes); // Alias por compatibilidad
app.use('/api/municipios', require('./routes/municipioRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Ruta base de comprobación de estado de la API
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Centralizada Multimunicipio en funcionamiento',
    timestamp: new Date()
  });
});

// Middleware para manejo global de errores 404 (Ruta no encontrada)
app.use((req, res, next) => {
  res.status(404).json({ error: 'La ruta solicitada no existe en la API' });
});

// Middleware para manejo global de errores 500 del servidor
app.use((err, req, res, next) => {
  console.error('❌ Error no controlado en el servidor:', err.stack);

  // Asegura responder con cabeceras CORS activas en caso de excepción no controlada
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');

  res.status(500).json({ 
    error: 'Ocurrió un error interno en el servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Arrancar el servidor Express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});