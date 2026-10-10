import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../services/api'; // Asegurate de que la ruta a tu api.js sea correcta
import '../../styles/Login.css';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Petición al endpoint de login
      const res = await API.post('/auth/login', { email, password });

      // Guardar el token en el localStorage si la respuesta es exitosa
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        // Redirigir al panel de administración
        navigate('/admin/noticias');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Credenciales inválidas');
    }
  };

  return (
    <div className="login-container max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
      
      {error && (
        <div className="alert alert-danger mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Correo Electrónico</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Contraseña</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}