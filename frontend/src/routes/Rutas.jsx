import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// CONFIGURACIÓN DINÁMICA
import { configActual } from '../config/municipios';

// Autenticación y Panel de Administración
import Login from '../components/pages/Login';
import NewsAdmin from '../components/pages/NewsAdmin';
import ProtectedRoute from '../components/ProtectedRoute';

// Páginas principales
import Portada from '../components/pages/Portada';
import Noticias from '../components/pages/Noticias';
import NewsDetail from '../components/pages/NewsDetail';
import Ubicacion from '../components/pages/Ubicacion';
import NotFound from '../components/pages/NotFound';

// Helper corregido: Si el token no existe, permite acceder a /login sin redirigir
const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Si no hay token guardado, muestra la página de Login
  if (!token) {
    return children;
  }
  
  return <Navigate to="/admin/noticias" replace />;
};

const Rutas = () => {
  return (
    <Routes>
      {/* Login público */}
      <Route 
        path="/login" 
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        } 
      />

      {/* Panel de Administración Protegido */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/noticias" element={<NewsAdmin />} />
        <Route path="/admin" element={<Navigate to="/admin/noticias" replace />} />
      </Route>

      {/* Rutas Públicas */}
      <Route path="/" element={<Portada />} />
      <Route path="/noticias" element={<Noticias />} />
      <Route path="/noticias/:id" element={<NewsDetail />} />

      {/* Ruta Exclusiva para Saladas */}
      <Route 
        path="/ubicacion" 
        element={
          configActual.id === 'saladas' ? (
            <Ubicacion municipioActivo={configActual} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Rutas;