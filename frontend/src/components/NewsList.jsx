import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Newspaper } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

import { configActual } from '../config/municipios';
import { getNoticias } from '../config/getNews';

import '../styles/NewsList.css';

const CATEGORIES = ["Todas", "GESTIÓN", "CULTURA", "SALUD", "DEPORTES", "OBRAS"];

function formatDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

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