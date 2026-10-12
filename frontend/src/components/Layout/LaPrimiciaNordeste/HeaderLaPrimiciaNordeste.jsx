import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderLaPrimiciaNordeste.css';

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

export default function HeaderLaPrimiciaNordeste(props) {
  const tenantKey = props.tenant || 'laprimicianordeste';
  const infoMunicipio = municipios[tenantKey] || municipios.laprimicianordeste;
  const { colores, logo, nombre } = infoMunicipio;

  const dynamicCategories = props.dynamicCategories || props.categories || props.categorias || [];
  const safeCategories = Array.isArray(dynamicCategories) ? dynamicCategories : [];

  const selectedCategory = props.selectedCategory || props.category || props.categoria || '';
  const setSelectedCategory = props.setSelectedCategory || props.onSelectCategory || props.setCategory;

  const onSearch = props.onSearch || props.setSearchTerm || props.handleSearch;
  const [terminoLocal, setTerminoLocal] = useState(props.searchTerm || '');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

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
      className="beacon-header-container"
      style={{
        '--beacon-red': colores?.primary || '#b91c1c',
        '--beacon-dark': colores?.secondary || '#111827'
      }}
    >
      {/* 1. BARRA PRINCIPAL */}
      <div className="beacon-main-bar">
        <div className="beacon-main-inner">

          {/* LADO IZQUIERDO: FECHA Y BUSCADOR */}
          <div className="beacon-left-box">
            <span className="beacon-date">{fechaFormateada}</span>
            <span className="beacon-divider-sm">|</span>
            {mostrarBuscador ? (
              <form className="beacon-search-inline" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={terminoLocal}
                  onChange={manejarCambioInput}
                  autoFocus
                />
                <button type="button" onClick={() => setMostrarBuscador(false)}>
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                className="beacon-search-btn"
                onClick={() => setMostrarBuscador(true)}
              >
                <Search size={16} />
                <span>Buscar</span>
              </button>
            )}
          </div>

          {/* CENTRO: ISOTIPO + LOGOTIPO */}
          <div className="beacon-center-logo">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              className="beacon-logo-link"
            >
              <img 
                src="/img/logos/iso_laprimicianordeste.png" 
                alt="Isotipo La Primicia Nordeste" 
                className="beacon-iso-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <img 
                src={logo || '/img/logos/laprimicianordeste.png'} 
                alt={nombre || 'LA PRIMICIA NORDESTE'} 
                className="beacon-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/laprimicianordeste.png';
                }}
              />
            </Link>
          </div>

          {/* LADO DERECHO: REDES SOCIALES */}
          <div className="beacon-right-box">
            <div className="beacon-social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X"><XIcon /></a>
            </div>
          </div>

        </div>
      </div>

      {/* BANNER PUBLICITARIO 728x90 */}
      <div className="beacon-ad-banner-container">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="beacon-ad-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </a>
      </div>

      {/* 2. NAVEGACIÓN EDITORIAL CON SEPARADORES | */}
      <nav className="beacon-bottom-nav">
        <div className="beacon-nav-inner">
          <button 
            type="button" 
            className={`beacon-nav-item ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
            onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
          >
            PORTADA
          </button>

          {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
            <React.Fragment key={cat}>
              <span className="beacon-nav-separator">|</span>
              <button
                type="button"
                className={`beacon-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
                onClick={() => setSelectedCategory && setSelectedCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            </React.Fragment>
          ))}
        </div>
      </nav>
    </header>
  );
}