import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Bell, ChevronDown } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderNorNoticias.css';

// ÍCONOS DE REDES SOCIALES EN SVG
const XIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export default function HeaderNorNoticias(props) {
  const tenantKey = props.tenant || 'nornoticiasya';
  const infoMunicipio = municipios[tenantKey] || municipios.nornoticiasya;
  const { colores, logo, nombre } = infoMunicipio;

  const dynamicCategories = props.dynamicCategories || props.categories || props.categorias || [];
  const safeCategories = Array.isArray(dynamicCategories) ? dynamicCategories : [];

  const selectedCategory = props.selectedCategory || props.category || props.categoria || '';
  const setSelectedCategory = props.setSelectedCategory || props.onSelectCategory || props.setCategory;

  const onSearch = props.onSearch || props.setSearchTerm || props.handleSearch;
  const [terminoLocal, setTerminoLocal] = useState(props.searchTerm || '');

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
      className="nor-header-container"
      style={{
        '--primary-color': colores?.primary || '#8cf043',
        '--secondary-color': colores?.secondary || '#121e2b',
        '--accent-color': colores?.accent || '#f4f6f8'
      }}
    >
      {/* 1. TOP BAR OSCURO */}
      <div className="nor-top-bar">
        <div className="nor-top-inner">
          <div className="nor-top-left">
            <span className="nor-date">{fechaFormateada}</span>
            <span className="nor-divider">|</span>
            <span className="nor-location">Corrientes, Argentina</span>
          </div>

          <div className="nor-top-right">
            <div className="nor-social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><FacebookIcon /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer"><XIcon /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><InstagramIcon /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"><YoutubeIcon /></a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer"><TelegramIcon /></a>
            </div>
            <span className="nor-divider">|</span>
            <Link to="/nosotros" className="nor-top-link">Nosotros</Link>
            <span className="nor-divider">|</span>
            <Link to="/contacto" className="nor-top-link">Contacto</Link>
          </div>
        </div>
      </div>

      {/* 2. LOGO Y BUSCADOR */}
      <div className="nor-main-bar">
        <div className="nor-main-inner">
          <Link to="/" onClick={() => setSelectedCategory && setSelectedCategory('Todas')}>
            <img 
              src={logo || '/img/logos/nornoticiasya.png'} 
              alt={nombre || 'NORNOTICIASYA'} 
              className="nor-logo-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/logos/nornoticiasya.png';
              }}
            />
          </Link>

          <div className="nor-action-box">
            <form className="nor-search-form" onSubmit={manejarEnvioFormulario}>
              <input 
                type="text" 
                placeholder="Buscar noticias..." 
                value={terminoLocal}
                onChange={manejarCambioInput}
              />
              <button type="submit" aria-label="Buscar">
                <Search size={18} />
              </button>
            </form>

            <button className="nor-btn-ultimas">
              <Bell size={16} />
              <span>Últimas noticias</span>
            </button>
          </div>
        </div>
      </div>

      

      {/* 3. NAVEGACIÓN INFERIOR */}
      <nav className="nor-bottom-nav">
        <div className="nor-nav-inner">
          <button 
            type="button" 
            className={`nor-nav-item btn-inicio ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
            onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
          >
            <Home size={16} />
            <span>INICIO</span>
          </button>

          {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
            <button
              key={cat}
              type="button"
              className={`nor-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
              onClick={() => setSelectedCategory && setSelectedCategory(cat)}
            >
              <span>{cat.toUpperCase()}</span>
              <ChevronDown size={14} className="nor-chevron" />
            </button>
          ))}
        </div>
      </nav>

      {/* BANNER PUBLICITARIO 728x90 */}
      <div className="nor-ad-banner-container">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="nor-ad-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </a>
      </div>
    </header>
  );
}