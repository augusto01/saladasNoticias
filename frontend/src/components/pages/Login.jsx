import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      
      const { token, user } = res.data;

      // Actualizar estado en el AuthContext y guardar en localStorage
      if (login) {
        login(user, token);
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Redirigir al panel de noticias
      navigate('/admin/noticias');
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Credenciales inválidas o error de conexión.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary-subtle text-primary d-inline-flex p-3 rounded-circle mb-3">
            <LogIn size={32} />
          </div>
          <h3 className="fw-bold text-dark mb-1">Iniciar Sesión</h3>
          <p className="text-muted small">Ingresá con tu cuenta para acceder al panel</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 small rounded-3 mb-4" role="alert">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold small text-secondary">Correo Electrónico</label>
            <input
              type="email"
              className="form-control form-control-lg fs-6"
              placeholder="usuario@municipio.gob.ar"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-secondary">Contraseña</label>
            <input
              type="password"
              className="form-control form-control-lg fs-6"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Ingresar al Panel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}