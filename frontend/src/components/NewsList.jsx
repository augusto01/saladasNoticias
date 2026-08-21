import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Newspaper } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

import { configActual } from '../config/municipios';
import { getNoticias } from '../config/getNews';

import '../styles/NewsList.css';

const CATEGORIES = ["Todas", "GESTIÓN", "CULTURA", "SALUD", "DEPORTES", "OBRAS"];

// Imagen por defecto tipo placeholder en formato SVG
const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%23f1f5f9'><rect width='100%' height='100%' fill='%23f1f5f9'/><path d='M360 210 L440 210 L440 290 L360 290 Z' fill='none' stroke='%2394a3b8' stroke-width='4'/><circle cx='385' cy='235' r='10' fill='%2394a3b8'/><path d='M365 280 L395 245 L415 265 L425 255 L435 280 Z' fill='%2394a3b8'/><text x='50%' y='340' font-family='sans-serif' font-size='20' font-weight='600' fill='%2364748b' text-anchor='middle'>Imagen no disponible</text></svg>";

function formatDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export default function NewsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const newsSummary = getNoticias() || [];

  const allFilteredNews = newsSummary.filter((item) => {
    const matchesCategory =
      selectedCategory === "Todas" ||
      (item.category || item.categoria)?.toUpperCase() === selectedCategory.toUpperCase();

    const matchesSearch =
      (item.title || item.titulo)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.summary || item.subtitulo || item.resumen)?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const hasNews = allFilteredNews.length > 0;
  const mainNews = hasNews ? allFilteredNews[0] : null;
  const secondaryNews = hasNews ? allFilteredNews.slice(1) : [];

  return (
    <div className="news-container">
      
      {/* BANNER HERO */}
      <section className="news-hero">
        <div className="news-hero-content">
          <span className="hero-tag">{configActual.saludo}</span>
          <h1 className="hero-title-main">{configActual.slogan}</h1>
          <p className="hero-subtitle">
            {configActual.descripcion}
          </p>
        </div>
      </section>

      {/* FILTROS Y CONTROLES */}
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

      {/* CONTENIDO PRINCIPAL */}
      <div className="news-grid">
        <section className="news-main-column">
          {!hasNews ? (
            <div className="no-news-found card p-5 text-center my-4 border-0 shadow-sm">
              <Newspaper size={48} className="mx-auto text-muted mb-3" />
              <h3>Aún no hay noticias en {configActual.nombre}</h3>
              <p className="text-muted mb-0">
                No se encontraron publicaciones con los filtros o búsquedas seleccionadas.
              </p>
            </div>
          ) : (
            <>
              {/* NOTICIA DESTACADA */}
              {mainNews && (
                <Link to={`/noticias/${mainNews.id}`} className="featured-news-card">
                  <div className="featured-img-wrapper">
                    <img 
                      src={mainNews.image || mainNews.imagen || `/news_${configActual.id}/${mainNews.id}/portada.jpg.webp`} 
                      alt={mainNews.title || mainNews.titulo} 
                      className="featured-img" 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = DEFAULT_PLACEHOLDER;
                      }}
                    />
                    <span className="news-badge">{mainNews.category || mainNews.categoria}</span>
                  </div>
                  <div className="featured-content">
                    <span className="news-date">{formatDate(mainNews.date || mainNews.fecha)}</span>
                    <h2 className="featured-title">{mainNews.title || mainNews.titulo}</h2>
                    <p className="featured-summary">{mainNews.summary || mainNews.subtitulo || mainNews.resumen}</p>
                  </div>
                </Link>
              )}

              {/* GRILLA SECUNDARIA */}
              {secondaryNews.length > 0 && (
                <div className="secondary-news-grid">
                  {secondaryNews.map((item) => (
                    <Link to={`/noticias/${item.id}`} key={item.id} className="secondary-news-card">
                      <div className="secondary-img-wrapper">
                        <img 
                          src={item.image || item.imagen || `/news_${configActual.id}/${item.id}/portada.jpg.webp`} 
                          alt={item.title || item.titulo} 
                          className="secondary-img" 
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = DEFAULT_PLACEHOLDER;
                          }}
                        />
                        <span className="news-badge-sm">{item.category || item.categoria}</span>
                      </div>
                      <div className="secondary-content">
                        <span className="news-date">{formatDate(item.date || item.fecha)}</span>
                        <h3 className="secondary-title">{item.title || item.titulo}</h3>
                        <p className="secondary-summary">{item.summary || item.subtitulo || item.resumen}</p>
                      </div>
                    </Link>
                  ))}
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

          {newsSummary.length > 0 && (
            <div className="sidebar-widget popular-widget">
              <h3 className="widget-title">Lo más leído</h3>
              <ul className="popular-list">
                {newsSummary.slice(0, 3).map((news, index) => (
                  <li key={news.id}>
                    <Link to={`/noticias/${news.id}`} className="popular-item">
                      <span className="popular-number">0{index + 1}</span>
                      <p className="popular-text">{news.title || news.titulo}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                alt="Publicidad institucional" 
                className="ad-banner-img"
              />
            </a>
          </div>
        </aside>

      </div>
    </div>
  );
}