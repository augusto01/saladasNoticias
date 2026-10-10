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
import Ejecutivo from '../components/pages/Ejecutivo';
import HCD from '../components/pages/Hcd';
import Boletines from '../components/pages/Boletines';
import CartaOrganica from '../components/pages/CartaOrganica';
import Ubicacion from '../components/pages/Ubicacion';
import Galeria from '../components/pages/Galeria';
import Contacto from '../components/pages/Contacto';

// Páginas de servicios
import Turnos from '../components/pages/Turnos';
import Entradas from '../components/pages/Entradas';

// Turismo / Cultura
import Estudiantina from '../components/pages/Estudiantina';

// Carnavales y agrupaciones
import Carnavales from '../components/pages/Carnavales';
import Sambatuque from '../components/pages/comparsas/Sambatuque';
import CarismaShow from '../components/pages/comparsas/CarismaShow';
import Ibera from '../components/pages/comparsas/Ibera';
import Xango from '../components/pages/comparsas/Xango';

// Detalle de Noticia
import NewsDetail from '../components/pages/NewsDetail';

// Página 404
import NotFound from '../components/pages/NotFound';

// Helper para evitar entrar a /login si ya estás autenticado
const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/admin/noticias" replace /> : children;
};

const Rutas = () => {
  return (
    <Routes>
      {/* Autenticación: Si ya hay token, redirige directo al admin */}
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
        {/* Alias opcional /admin que redirige a /admin/noticias */}
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

      {/* Ruta comodín (404) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Rutas;