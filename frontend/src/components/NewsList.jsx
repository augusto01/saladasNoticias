import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Newspaper } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

// ----------------------------------------------------------------------
// DESCOMENTAR CUANDO TENGAS LAS NOTICIAS LISTAS EN EL JSON:
// import newsSummary from '../components/data/newsSummary.json';
// ----------------------------------------------------------------------

import '../styles/NewsList.css';

const CATEGORIES = ["Todas", "GESTIÓN", "CULTURA", "SALUD", "DEPORTES", "OBRAS"];

function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export default function NewsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // ----------------------------------------------------------------------
  // NOTICIAS DESACTIVADAS TEMPORALMENTE PARA DEPLOY:
  const newsSummary = []; // Cuando quieras activar noticias, comentá esta línea y descomentá la importación de arriba.
  // ----------------------------------------------------------------------

  const hasNews = Array.isArray(newsSummary) && newsSummary.length > 0;

  const mainNews = hasNews ? newsSummary[0] : null;
  const secondaryNews = hasNews ? newsSummary.slice(1) : [];

  const filteredNews = secondaryNews.filter((item) => {
    const matchesCategory =
      selectedCategory === "Todas" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="news-container">
      
      {/* BANNER INSTITUCIONAL / HERO TOP */}
      <section className="news-hero">
        <div className="news-hero-content">
          <span className="hero-tag">¡Hola Saladeño!</span>
          <h1 className="hero-title-main">Noticias del Municipio</h1>
          <p className="hero-subtitle">
            Mantente al día con las últimas novedades, obras y eventos de nuestra querida ciudad de Saladas. Aquí encontrarás información oficial, comunicados y noticias relevantes para la comunidad.
          </p>
        </div>
      </section>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <section className="news-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar noticias u obras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          <Filter size={16} className="filter-icon" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL EN 2 COLUMNAS */}
      <div className="news-grid">
        
        {/* COLUMNA IZQUIERDA: NOTICIAS O MENSAJE VACÍO */}
        <section className="news-main-column">
          {!hasNews ? (
            <div className="no-news-found card p-5 text-center my-4 border-0 shadow-sm">
              <Newspaper size={48} className="mx-auto text-muted mb-3" />
              <h3>Aún no hay noticias publicadas</h3>
              <p className="text-muted mb-0">
                Estamos trabajando para traerte las novedades más recientes del municipio. ¡Vuelve pronto!
              </p>
            </div>
          ) : (
            <>
              {/* NOTICIA PRINCIPAL DESTACADA */}
              {mainNews &&
                (selectedCategory === "Todas" || mainNews.category === selectedCategory) &&
                (!searchTerm || mainNews.title.toLowerCase().includes(searchTerm.toLowerCase())) && (
                  <Link to={`/noticias/${mainNews.id}`} className="featured-news-card">
                    <div className="featured-img-wrapper">
                      <img src={mainNews.image} alt={mainNews.title} className="featured-img" />
                      <span className="news-badge">{mainNews.category}</span>
                    </div>
                    <div className="featured-content">
                      <span className="news-date">{formatDate(mainNews.date)}</span>
                      <h2 className="featured-title">{mainNews.title}</h2>
                      <p className="featured-summary">{mainNews.summary}</p>
                    </div>
                  </Link>
                )}

              {/* GRILLA DE NOTICIAS SECUNDARIAS */}
              {filteredNews.length > 0 ? (
                <div className="secondary-news-grid">
                  {filteredNews.map((item) => (
                    <Link to={`/noticias/${item.id}`} key={item.id} className="secondary-news-card">
                      <div className="secondary-img-wrapper">
                        <img src={item.image} alt={item.title} className="secondary-img" />
                        <span className="news-badge-sm">{item.category}</span>
                      </div>
                      <div className="secondary-content">
                        <span className="news-date">{formatDate(item.date)}</span>
                        <h3 className="secondary-title">{item.title}</h3>
                        <p className="secondary-summary">{item.summary}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="no-news-found">
                  <p>No se encontraron noticias con los filtros seleccionados.</p>
                </div>
              )}
            </>
          )}
        </section>

        {/* COLUMNA DERECHA: SIDEBAR */}
        <aside className="news-sidebar">
          
          {/* WIDGET DEL CLIMA */}
          <div className="sidebar-widget">
            <WeatherWidget />
          </div>

          {/* LO MÁS LEÍDO (SE OCULTA AUTOMÁTICAMENTE CUANDO NO HAY NOTICIAS) */}
          {hasNews && (
            <div className="sidebar-widget popular-widget">
              <h3 className="widget-title">Lo más leído</h3>
              <ul className="popular-list">
                {newsSummary.slice(0, 3).map((news, index) => (
                  <li key={news.id}>
                    <Link to={`/noticias/${news.id}`} className="popular-item">
                      <span className="popular-number">0{index + 1}</span>
                      <p className="popular-text">{news.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BANNER PUBLICIDAD GOBIERNO */}
          <div className="sidebar-widget ad-widget">
            <span className="ad-label">Publicidad</span>
            <a 
              href="https://www.argentina.gob.ar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ad-banner-link"
            >
              <img 
                src="/300x300bannerweb.gif" 
                alt="Publicidad institucional del gobierno" 
                className="ad-banner-img"
              />
            </a>
          </div>

        </aside>

      </div>
    </div>
  );
}