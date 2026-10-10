import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  // Si no hay token guardado, redirige de inmediato al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Opcional: Validar si el JWT está expirado leyendo su payload de forma segura
  try {
    const payloadBase64 = token.split('.')[1];
    if (payloadBase64) {
      const decodedJson = JSON.parse(atob(payloadBase64));
      const exp = decodedJson.exp;
      
      // Si el tiempo actual superó el tiempo de expiración (exp en segundos)
      if (exp && Date.now() >= exp * 1000) {
        console.warn('🔒 Token JWT expirado. Limpiando sesión...');
        localStorage.clear();
        return <Navigate to="/login" replace />;
      }
    }
  } catch (e) {
    // Si el token es inválido o no se puede decodificar, limpiar y salir
    console.error('🔒 Token corrupto o inválido:', e);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}