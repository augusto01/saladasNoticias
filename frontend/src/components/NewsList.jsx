import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Newspaper } from 'lucide-react';
import axios from 'axios';

import WeatherWidget from './WeatherWidget';

// Importación de Headers específicos por municipio
import HeaderSaladas from './Layout/Saladas/HeaderSaladas';
import HeaderCorrientes from './Layout/Corrientes/HeaderCorrientes';
import HeaderItuzaingo from './Layout/Ituzaingo/HeaderItuzaingo';
import HeaderSantaRosa from './Layout/SR/HeaderSantaRosa';

import { configActual } from '../config/municipios';
import '../styles/NewsList.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MUNICIPIO_ID = import.meta.env.VITE_MUNICIPIO_ID || import.meta.env.VITE_MUNICIPIO;

const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%23f1f5f9'><rect width='100%' height='100%' fill='%23f1f5f9'/><path d='M360 210 L440 210 L440 290 L360 290 Z' fill='none' stroke='%2394a3b8' stroke-width='4'/><circle cx='385' cy='235' r='10' fill='%2394a3b8'/><path d='M365 280 L395 245 L415 265 L425 255 L435 280 Z' fill='%2394a3b8'/><text x='50%' y='340' font-family='sans-serif' font-size='20' font-weight='600' fill='%2364748b' text-anchor='middle'>Imagen no disponible</text></svg>";

function parseSafeDate(dateString) {
  if (!dateString) return new Date(0);
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date(0) : date;
}

function formatDate(dateString) {
  const date = parseSafeDate(dateString);
  if (date.getTime() === 0) return dateString || '';

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export default function NewsList() {
  const [newsSummary, setNewsSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${BACKEND_URL}/noticias`, {
          params: { municipio: MUNICIPIO_ID }
        });

        const newsArray = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        setNewsSummary(newsArray);
      } catch (err) {
        console.error('Error al cargar noticias de la API:', err);
        setError('No se pudieron obtener las noticias.');
      } finally {
        setLoading(false);
      }
    };

    if (MUNICIPIO_ID) {
      fetchNews();
    }
  }, []);

  const dynamicCategories = [
    "Todas",
    ...Array.from(
      new Set(
        newsSummary
          .map((item) => item.categoria || item.category)
          .filter(Boolean)
          .map((cat) => cat.trim().toUpperCase())
      )
    ),
  ];

  const filteredNews = newsSummary.filter((item) => {
    const cat = item.categoria || item.category || "";
    const matchesCategory =
      selectedCategory === "Todas" ||
      cat.toUpperCase() === selectedCategory.toUpperCase();

    const title = item.titulo || item.title || "";
    const summary = item.subtitulo || item.summary || item.resumen || "";
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    const timeA = parseSafeDate(a.fechaPublicacion || a.createdAt || a.date).getTime();
    const timeB = parseSafeDate(b.fechaPublicacion || b.createdAt || b.date).getTime();
    return timeB - timeA;
  });

  const hasNews = sortedNews.length > 0;
  const mainNews = hasNews ? sortedNews[0] : null;
  const secondaryNews = hasNews ? sortedNews.slice(1) : [];

  const sortedAllNews = [...newsSummary].sort((a, b) => {
    const timeA = parseSafeDate(a.fechaPublicacion || a.createdAt || a.date).getTime();
    const timeB = parseSafeDate(b.fechaPublicacion || b.createdAt || b.date).getTime();
    return timeB - timeA;
  });

  const renderHeader = () => {
    const municipio = MUNICIPIO_ID?.toLowerCase().trim();

    const headerProps = {
      configActual,
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      dynamicCategories
    };

    switch (municipio) {
      case 'saladas':
        return <HeaderSaladas {...headerProps} />;
      case 'corrientes':
        return <HeaderCorrientes {...headerProps} />;
      case 'ituzaingo':
        return <HeaderItuzaingo {...headerProps} />;
      case 'santarosa':
      case 'santa-rosa':
      case 'santa_rosa':
        return <HeaderSantaRosa {...headerProps} />;
      default:
        return <HeaderItuzaingo {...headerProps} />;
    }
  };

  return (
    <>
      {/* HEADER FULL WIDTH */}
      {renderHeader()}

      <div className="news-container">
        {/* CONTENIDO PRINCIPAL */}
        <div className="news-grid">
          <section className="news-main-column">
            {loading ? (
              <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando noticias...</span>
                </div>
                <p className="mt-3 text-muted">Cargando noticias en tiempo real...</p>
              </div>
            ) : !hasNews ? (
              <div className="no-news-found card p-5 text-center my-4 border-0 shadow-sm">
                <Newspaper size={48} className="mx-auto text-muted mb-3" />
                <h3>Aún no hay noticias en {configActual?.nombre || 'la localidad'}</h3>
                <p className="text-muted mb-0">
                  No se encontraron publicaciones con los filtros o búsquedas seleccionadas.
                </p>
              </div>
            ) : (
              <>
                {/* NOTICIA DESTACADA */}
                {mainNews && (
                  <Link to={`/noticias/${mainNews._id || mainNews.id}`} className="featured-news-card">
                    <div className="featured-img-wrapper">
                      <img 
                        src={mainNews.imagenPrincipal || DEFAULT_PLACEHOLDER} 
                        alt={mainNews.titulo || mainNews.title} 
                        className="featured-img" 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = DEFAULT_PLACEHOLDER;
                        }}
                      />
                      <span className="news-badge">{mainNews.categoria || mainNews.category}</span>
                    </div>
                    <div className="featured-content">
                      <span className="news-date">{formatDate(mainNews.fechaPublicacion || mainNews.createdAt || mainNews.date)}</span>
                      <h2 className="featured-title">{mainNews.titulo || mainNews.title}</h2>
                      <p className="featured-summary">{mainNews.subtitulo || mainNews.summary || mainNews.resumen}</p>
                    </div>
                  </Link>
                )}

                {/* GRILLA SECUNDARIA */}
                {secondaryNews.length > 0 && (
                  <div className="secondary-news-grid">
                    {secondaryNews.map((item, index) => {
                      const itemId = item._id || item.id || index;
                      return (
                        <Link 
                          to={`/noticias/${itemId}`} 
                          key={itemId} 
                          className="secondary-news-card"
                        >
                          <div className="secondary-img-wrapper">
                            <img 
                              src={item.imagenPrincipal || DEFAULT_PLACEHOLDER} 
                              alt={item.titulo || item.title} 
                              className="secondary-img" 
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = DEFAULT_PLACEHOLDER;
                              }}
                            />
                            <span className="news-badge-sm">{item.categoria || item.category}</span>
                          </div>
                          <div className="secondary-content">
                            <span className="news-date">{formatDate(item.fechaPublicacion || item.createdAt || item.date)}</span>
                            <h3 className="secondary-title">{item.titulo || item.title}</h3>
                            <p className="secondary-summary">{item.subtitulo || item.summary || item.resumen}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>

          {/* SIDEBAR */}
          <aside className="news-sidebar">
            <div className="sidebar-widget">
              <WeatherWidget />
            </div>

            {sortedAllNews.length > 0 && (
              <div className="sidebar-widget popular-widget">
                <h3 className="widget-title">Lo más leído</h3>
                <ul className="popular-list">
                  {sortedAllNews.slice(0, 3).map((news, index) => {
                    const newsId = news._id || news.id || index;
                    return (
                      <li key={newsId}>
                        <Link to={`/noticias/${newsId}`} className="popular-item">
                          <span className="popular-number">0{index + 1}</span>
                          <p className="popular-text">{news.titulo || news.title}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="sidebar-widget ad-widget">
              <a 
                href="https://www.argentina.gob.ar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ad-banner-link"
              >
                <img 
                  src="/300x300bannerweb.gif" 
                  alt="Publicidad institucional" 
                  className="ad-banner-300-img"
                />
              </a>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}