import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Calendar, MapPin, Megaphone, ChevronDown } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderRedMesopotamia.css';

const XIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function HeaderRedMesopotamia(props) {
  const tenantKey = props.tenant || 'redmesopotamialdia';
  const infoMunicipio = municipios[tenantKey] || municipios.redmesopotamialdia;
  const { colores, logo, nombre } = infoMunicipio;

  const dynamicCategories = props.dynamicCategories || props.categories || props.categorias || [];
  const safeCategories = Array.isArray(dynamicCategories) ? dynamicCategories : [];

  const selectedCategory = props.selectedCategory || props.category || props.categoria || '';
  const setSelectedCategory = props.setSelectedCategory || props.onSelectCategory || props.setCategory;

  const onSearch = props.onSearch || props.setSearchTerm || props.handleSearch;
  const [terminoLocal, setTerminoLocal] = useState(props.searchTerm || '');

  // Declaración limpia de ultimasNoticias dentro del scope del componente
  const ultimasNoticias = (props.noticias || [])
    .slice()
    .sort((a, b) => new Date(b.fechaPublicacion || b.createdAt) - new Date(a.fechaPublicacion || a.createdAt))
    .slice(0, 8);

  const manejarCambioInput = (e) => {
    const valor = e.target.value;
    setTerminoLocal(valor);
    if (onSearch) onSearch(valor);
  };

  const manejarEnvioFormulario = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(terminoLocal);
  };

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const fechaFormateada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

  return (
    <header 
      className="meso-header-container"
      style={{
        '--meso-primary': colores?.primary || '#b84c28',
        '--meso-secondary': colores?.secondary || '#8c3116',
        '--meso-bg': colores?.accent || '#f8f6f0'
      }}
    >
      {/* 1. TOP BAR */}
      <div className="meso-top-bar">
        <div className="meso-top-inner">
          <div className="meso-top-left">
            <Calendar size={14} className="meso-icon-muted" />
            <span className="meso-date">{fechaFormateada}</span>
            <span className="meso-divider">|</span>
            <MapPin size={14} className="meso-icon-muted" />
            <span className="meso-location">Región Mesopotámica, Argentina</span>
          </div>

          <div className="meso-top-right">
            <div className="meso-social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><XIcon /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Youtube"><YoutubeIcon /></a>
            </div>
            <span className="meso-divider">|</span>
            <Link to="/nosotros" className="meso-top-link">Nosotros</Link>
            <span className="meso-divider">|</span>
            <Link to="/contacto" className="meso-top-link">Contacto</Link>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE LOGO Y BUSCADOR */}
      <div className="meso-main-bar">
        <div className="meso-main-inner">
          <div className="meso-logo-box">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
            >
              <img 
                src={logo || '/img/logos/redmesopotamiaaldia.png'} 
                alt={nombre || 'RED MESOPOTAMIA AL DÍA'} 
                className="meso-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/redmesopotamiaaldia.png';
                }}
              />
            </Link>
          </div>

          <div className="meso-search-box">
            <form className="meso-search-form" onSubmit={manejarEnvioFormulario}>
              <input 
                type="text" 
                placeholder="Buscar noticias, temas o palabras clave..." 
                value={terminoLocal}
                onChange={manejarCambioInput}
              />
              <button type="submit" aria-label="Buscar">
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BANNER PUBLICITARIO 728x90 */}
      <div className="meso-ad-banner-container">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="meso-ad-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </a>
      </div>

      {/* 3. NAVEGACIÓN DE CATEGORÍAS */}
      <nav className="meso-bottom-nav">
        <div className="meso-nav-inner">
          <button 
            type="button" 
            className={`meso-nav-item btn-inicio ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
            onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
          >
            <Home size={15} />
            <span>INICIO</span>
          </button>

          {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
            <button
              key={cat}
              type="button"
              className={`meso-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
              onClick={() => setSelectedCategory && setSelectedCategory(cat)}
            >
              <span>{cat.toUpperCase()}</span>
              <ChevronDown size={13} className="meso-chevron" />
            </button>
          ))}
        </div>
      </nav>

      {/* 4. MARQUESINA DINÁMICA DE ÚLTIMAS NOTICIAS */}
      <div className="meso-ticker-bar">
        <div className="meso-ticker-inner">
          <div className="meso-ticker-badge">
            <Megaphone size={16} />
            <span>ÚLTIMAS NOTICIAS</span>
          </div>

          <div className="meso-ticker-content">
            <div className="meso-ticker-track">
              {ultimasNoticias.length > 0 ? (
                ultimasNoticias.map((news, idx) => (
                  <span key={news._id || news.id || idx} className="meso-ticker-item">
                    <span className="meso-ticker-bullet">•</span>
                    <Link to={`/noticias/${news._id || news.id}`}>
                      {news.titulo || news.title}
                    </Link>
                  </span>
                ))
              ) : (
                <span className="meso-ticker-item">
                  <span className="meso-ticker-bullet">•</span>
                  <span>Cargando noticias de la región...</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}