import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

// Componentes de Header por Municipio
import HeaderSaladas from '../components/Layout/Saladas/HeaderSaladas';
import HeaderSantaRosa from '../components/Layout/SR/HeaderSantaRosa';
import HeaderItuzaingo from '../components/Layout/Ituzaingo/HeaderItuzaingo';

import { configActual } from '../config/municipios';
import API from '../../services/api';

import '../styles/NewsList.css';

const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%23f1f5f9'><rect width='100%' height='100%' fill='%23f1f5f9'/><path d='M360 210 L440 210 L440 290 L360 290 Z' fill='none' stroke='%2394a3b8' stroke-width='4'/><circle cx='385' cy='235' r='10' fill='%2394a3b8'/><path d='M365 280 L395 245 L415 265 L425 255 L435 280 Z' fill='%2394a3b8'/><text x='50%' y='340' font-family='sans-serif' font-size='20' font-weight='600' fill='%2364748b' text-anchor='middle'>Imagen no disponible</text></svg>";

function parseSafeDate(dateString) {
  if (!dateString) return new Date(0);
  const parsed = new Date(dateString);
  if (!isNaN(parsed.getTime())) return parsed;
  return new Date(0);
}

function formatDate(dateString) {
  const date = parseSafeDate(dateString);
  if (date.getTime() === 0) return dateString;

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export default function NewsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [newsSummary, setNewsSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detectar municipio activo desde el archivo .env o la configuración actual
  const municipioEnv = (
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_MUNICIPIO_ID) ||
    (typeof process !== 'undefined' && process.env && process.env.REACT_APP_MUNICIPIO_ID) ||
    configActual.id ||
    'saladas'
  ).toLowerCase();

  // 1. Cargar noticias dinámicas desde la API de MongoDB
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/noticias?municipio=${municipioEnv}`);
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        const publicadas = data.filter(item => item.publicado !== false);
        setNewsSummary(publicadas);
      } catch (error) {
        console.error('Error al cargar noticias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [municipioEnv]);

  // 2. Extraer categorías dinámicas directamente de la Base de Datos
  const dynamicCategories = [
    "Todas",
    ...Array.from(
      new Set(
        newsSummary
          .map((item) => item.category || item.categoria)
          .filter(Boolean)
          .map((cat) => cat.trim().toUpperCase())
      )
    ),
  ];

  // 3. Filtrar noticias por categoría seleccionada y término del buscador
  const filteredNews = newsSummary.filter((item) => {
    const cat = item.category || item.categoria || "";
    const matchesCategory =
      selectedCategory === "Todas" ||
      cat.toUpperCase() === selectedCategory.toUpperCase();

    const title = item.title || item.titulo || "";
    const summary = item.summary || item.subtitulo || item.resumen || "";
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // 4. Ordenar noticias por fecha más reciente
  const sortedNews = [...filteredNews].sort((a, b) => {
    const timeA = parseSafeDate(a.fechaPublicacion || a.createdAt).getTime();
    const timeB = parseSafeDate(b.fechaPublicacion || b.createdAt).getTime();
    return timeB - timeA;
  });

  const hasNews = sortedNews.length > 0;
  const mainNews = hasNews ? sortedNews[0] : null;
  const secondaryNews = hasNews ? sortedNews.slice(1) : [];

  // 5. Renderizado del Header según la variable de entorno
  const renderHeader = () => {
    switch (municipioEnv) {
      case 'ituzaingo':
      return (
        <HeaderItuzaingo
          configActual={configActual}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          dynamicCategories={dynamicCategories}
        />
      );
      case 'santarosa':
        return (
          <HeaderSantaRosa
            configActual={configActual}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            dynamicCategories={dynamicCategories}
          />
        );
      case 'saladas':
      default:
        return (
          <HeaderSaladas
            configActual={configActual}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            dynamicCategories={dynamicCategories}
          />
        );
    }
  };

  return (
    <div className="news-page-wrapper">
      
      {/* HEADER DINÁMICO DE SEGÚN .ENV */}
      {renderHeader()}

      {/* GRILLA PRINCIPAL DE NOTICIAS Y SIDEBAR */}
      <div className="container news-container">
        <div className="news-grid">
          
          {/* COLUMNA PRINCIPAL DE NOTICIAS */}
          <section className="news-main-column">
            {loading ? (
              <div className="card p-5 text-center my-4 border-0 shadow-sm">
                <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
                <p className="text-muted mb-0">Cargando noticias de {configActual.nombre}...</p>
              </div>
            ) : !hasNews ? (
              <div className="no-news-found card p-5 text-center my-4 border-0 shadow-sm">
                <Newspaper size={48} className="mx-auto text-muted mb-3" />
                <h3>Aún no hay noticias en {configActual.nombre}</h3>
                <p className="text-muted mb-0">No se encontraron publicaciones que coincidan con la búsqueda o categoría.</p>
              </div>
            ) : (
              <>
                {/* NOTICIA DESTACADA (PRINCIPAL) */}
                {mainNews && (
                  <Link to={`/noticias/${mainNews._id || mainNews.id}`} className="featured-news-card">
                    <div className="featured-img-wrapper">
                      <img 
                        src={mainNews.imagenPrincipal || mainNews.image || mainNews.imagen || DEFAULT_PLACEHOLDER} 
                        alt={mainNews.titulo || mainNews.title} 
                        className="featured-img" 
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PLACEHOLDER; }}
                      />
                      <span className="news-badge">{mainNews.categoria || mainNews.category}</span>
                    </div>
                    <div className="featured-content">
                      <span className="news-date">
                        {formatDate(mainNews.fechaPublicacion || mainNews.createdAt || mainNews.date)}
                      </span>
                      <h2 className="featured-title">{mainNews.titulo || mainNews.title}</h2>
                      <p className="featured-summary">{mainNews.subtitulo || mainNews.summary || mainNews.resumen}</p>
                    </div>
                  </Link>
                )}

                {/* GRILLA SECUNDARIA */}
                {secondaryNews.length > 0 && (
                  <div className="secondary-news-grid">
                    {secondaryNews.map((item) => {
                      const itemId = item._id || item.id;
                      return (
                        <Link to={`/noticias/${itemId}`} key={itemId} className="secondary-news-card">
                          <div className="secondary-img-wrapper">
                            <img 
                              src={item.imagenPrincipal || item.image || item.imagen || DEFAULT_PLACEHOLDER} 
                              alt={item.titulo || item.title} 
                              className="secondary-img"
                              onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PLACEHOLDER; }}
                            />
                            <span className="news-badge-sm">{item.categoria || item.category}</span>
                          </div>
                          <div className="secondary-content">
                            <span className="news-date">
                              {formatDate(item.fechaPublicacion || item.createdAt || item.date)}
                            </span>
                            <h3 className="secondary-title">{item.titulo || item.title}</h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>

          {/* SIDEBAR DERECHO (CLIMA + PUBLICIDAD 300x300) */}
          <aside className="news-sidebar">
            <div className="sidebar-widget">
              <WeatherWidget />
            </div>

            <div className="sidebar-widget ad-widget text-center">
              <a href="https://www.argentina.gob.ar" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/300x300bannerweb.gif" 
                  alt="Publicidad Lateral" 
                  className="img-fluid rounded shadow-sm"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </a>
            </div>
          </aside>

        </div>
      </div>

    </div>
  );
}