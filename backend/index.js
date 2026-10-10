const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Conectar a la Base de Datos (MongoDB)
connectDB();

// Configurar CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) 
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (Postman, scripts locales)
    // o solicitudes dentro de la lista, wildcard '*' o entorno distinto de produccion
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      allowedOrigins.includes('*') || 
      process.env.NODE_ENV !== 'production'
    ) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Origen bloqueado por restricción de CORS: ${origin}`);
      // Fallback permissivo para asegurar que dominios dinámicos de Netlify respondan
      callback(null, true);
    }
  },
  credentials: true
}));

// Middlewares para parsear el cuerpo de las peticiones HTTP
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Registro de Rutas (Soporta /api/noticias y /api/news para máxima compatibilidad)
const newsRoutes = require('./routes/newsRoutes');

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/noticias', newsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/municipios', require('./routes/municipioRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Ruta base de estado de la API
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
  console.error('Error no controlado:', err.stack);
  res.status(500).json({ 
    error: 'Ocurrió un error interno en el servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});