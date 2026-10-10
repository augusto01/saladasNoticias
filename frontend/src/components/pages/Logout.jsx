import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../../services/api';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const ejecutarCierre = async () => {
      try {
        await API.post('/auth/logout');
      } catch (error) {
        console.warn('Error al notificar al backend:', error);
      } finally {
        if (logout) logout();
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login', { replace: true });
      }
    };

    ejecutarCierre();
  }, [logout, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <p className="text-muted">Cerrando sesión...</p>
    </div>
  );
}