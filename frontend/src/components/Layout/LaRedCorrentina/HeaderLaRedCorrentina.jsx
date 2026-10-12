import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderLaRedCorrentina.css';

export default function HeaderLaRedCorrentina(props) {
  const tenantKey = props.tenant || 'laredcorrentina';
  const infoMunicipio = municipios[tenantKey] || municipios.laredcorrentina;
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

  return (
    <header 
      className="lrc-header-container"
      style={{
        '--lrc-teal': colores?.primary || '#0f766e',
        '--lrc-dark-green': colores?.secondary || '#064e3b'
      }}
    >
      {/* 1. TOP BAR VERDE OSCURO */}
      <div className="lrc-top-bar">
        <div className="lrc-top-inner">
          <span className="lrc-top-tagline">Red de noticias de toda la provincia</span>
          <div className="lrc-top-links">
            <Link to="/contacto">Contacto</Link>
            <Link to="/nosotros">Institucional</Link>
          </div>
        </div>
      </div>

      {/* 2. BARRA PRINCIPAL (ISOTIPO + LOGOTIPO + BUSCADOR) */}
      <div className="lrc-main-bar">
        <div className="lrc-main-inner">
          
          {/* BRANDING: ISOTIPO + LOGOTIPO */}
          <div className="lrc-brand-box">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              className="lrc-logo-link"
            >
              <img 
                src="/img/logos/iso_laredcorrentina.png" 
                alt="Isotipo La Red Correntina" 
                className="lrc-iso-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/iso_laredcorrentina.png';
                }}
              />
              <img 
                src={logo || '/img/logos/laredcorrentina.png'} 
                alt={nombre || 'LA RED CORRENTINA'} 
                className="lrc-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/laredcorrentina.png';
                }}
              />
            </Link>
          </div>

          {/* BUSCADOR ROUNDED */}
          <div className="lrc-search-box">
            <form className="lrc-search-form" onSubmit={manejarEnvioFormulario}>
              <Search size={18} className="lrc-search-icon" />
              <input 
                type="text" 
                placeholder="Buscar en la red..." 
                value={terminoLocal}
                onChange={manejarCambioInput}
              />
              {terminoLocal && (
                <button 
                  type="button" 
                  onClick={() => {
                    setTerminoLocal('');
                    if (onSearch) onSearch('');
                  }}
                  className="lrc-clear-btn"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* 3. NAVEGACIÓN DE CATEGORÍAS */}
      <nav className="lrc-bottom-nav">
        <div className="lrc-nav-inner">
          <button 
            type="button" 
            className={`lrc-nav-item ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
            onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
          >
            Portada
          </button>

          {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
            <button
              key={cat}
              type="button"
              className={`lrc-nav-item ${(selectedCategory || '').toLowerCase() === cat.toLowerCase() ? 'activo' : ''}`}
              onClick={() => setSelectedCategory && setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* BANNER PUBLICITARIO 728x90 */}
      <div className="lrc-banner-container">
        <a href="https://www.corrientes.gob.ar" target="_blank" rel="noopener noreferrer">
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="lrc-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>
    </header>
  );
}