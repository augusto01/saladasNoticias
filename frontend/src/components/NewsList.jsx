import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtiene la URL base y el ID del municipio desde las variables de entorno de Vite (.env)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://tu-backend.onrender.com/api';
  const MUNICIPIO_ID = import.meta.env.VITE_MUNICIPIO_ID || 'saladas';

  useEffect(() => {
    const fetchNews = async () => {
        try {
          setLoading(true);
          setError(null);

          // Consulta al endpoint correcto en español /noticias
          const response = await axios.get(`${BACKEND_URL}/noticias`, {
            params: { municipio: MUNICIPIO_ID }
          });

          // Extrae la lista de noticias de response.data.data si es un objeto, 
          // o de response.data si viniera como array directo
          const newsArray = response.data?.data || (Array.isArray(response.data) ? response.data : []);

          setNews(newsArray);
        } catch (err) {
          console.error('Error al cargar las noticias:', err);
          setError('No se pudieron cargar las noticias. Intente nuevamente más tarde.');
        } finally {
          setLoading(false);
        }
      };
          fetchNews();
  }, [BACKEND_URL, MUNICIPIO_ID]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No hay noticias publicadas para esta localidad en este momento.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-600 pb-2 capitalize">
        Últimas Noticias - {MUNICIPIO_ID}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <article 
            key={item._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
          >
            <div>
              {item.imagenPrincipal && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imagenPrincipal}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-news.jpg'; // Imagen de respaldo si falla
                    }}
                  />
                  {item.categoria && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                      {item.categoria}
                    </span>
                  )}
                </div>
              )}

              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">
                  {item.fechaPublicacion 
                    ? new Date(item.fechaPublicacion).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    : ''}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {item.titulo}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {item.subtitulo}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <Link
                to={`/noticia/${item._id}`}
                className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Leer noticia completa
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsList;