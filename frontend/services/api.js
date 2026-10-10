import axios from 'axios';

// Prioriza VITE_BACKEND_URL, luego VITE_API_URL y como fallback la URL de Render en producción
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 
                 import.meta.env.VITE_API_URL || 
                 'https://backend-municipios.onrender.com/api';

const API = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para inyectar automáticamente el token JWT en cada Petición Privada
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;