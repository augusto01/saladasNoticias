import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, Mail, X } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderPrimiciasCorrientes.css';

export default function HeaderPrimiciasCorrientes(props) {
  const tenantKey = props.tenant || 'primiciascorrientes';
  const infoMunicipio = municipios[tenantKey] || municipios.primiciascorrientes;
  const { colores, logo, nombre } = infoMunicipio;

  const dynamicCategories = props.dynamicCategories || props.categories || props.categorias || [];
  const safeCategories = Array.isArray(dynamicCategories) ? dynamicCategories : [];

  const tags = props.tags || [];
  const noticiasDinamicas = props.noticias || [];

  const temasDinamicos = tags.length > 0 
    ? tags.slice(0, 4) 
    : noticiasDinamicas.slice(0, 4).map(item => item.titulo || item.title || item.categoria);

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
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header 
      className="m1-header-container"
      style={{
        '--m1-red': colores?.primary || '#b91c1c',
        '--m1-dark-red': colores?.secondary || '#991b1b',
        '--m1-black': '#0a0a0a'
      }}
    >
      {/* 1. TOP BAR NEGRO */}
      <div className="m1-top-bar">
        <div className="m1-top-inner">
          <div className="m1-topics-group">
            <span className="m1-topics-label">Temas del día</span>
            <div className="m1-topics-list">
              {temasDinamicos.length > 0 ? (
                temasDinamicos.map((tema, idx) => (
                  <button 
                    key={idx} 
                    className="m1-topic-item"
                    onClick={() => setSelectedCategory && setSelectedCategory(tema)}
                  >
                    {tema}
                  </button>
                ))
              ) : (
                <span className="m1-topic-item">Cargando tendencias...</span>
              )}
            </div>
          </div>
          <div className="m1-top-right">
            <span className="m1-clima-link">Clima</span>
          </div>
        </div>
      </div>

      {/* 2. FRANJA ROJA PRINCIPAL */}
      <div className="m1-main-bar">
        <div className="m1-main-inner">
          
          <div className="m1-left-box">
            <button className="m1-menu-btn" aria-label="Menú">
              <Menu size={26} />
            </button>
            <span className="m1-date-text">{fechaHoy}</span>
          </div>

          <div className="m1-center-logo">
            <Link to="/" onClick={() => setSelectedCategory && setSelectedCategory('Todas')}>
              <img 
                src={logo || '/img/logos/primiciascorrienteslogo.png'} 
                alt={nombre || 'PRIMICIAS CORRIENTES'} 
                className="m1-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/primiciascorrienteslogo.png';
                }}
              />
            </Link>
          </div>

          <div className="m1-right-box">
            {mostrarBuscador ? (
              <form className="m1-search-inline-form" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={terminoLocal}
                  onChange={manejarCambioInput}
                  autoFocus
                />
                <button type="button" className="m1-search-close" onClick={() => setMostrarBuscador(false)}>
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                className="m1-search-trigger"
                onClick={() => setMostrarBuscador(true)}
                aria-label="Buscar"
              >
                <Search size={22} />
              </button>
            )}

            
          </div>

        </div>
      </div>

      

      {/* 3. NAVEGACIÓN INFERIOR (CATEGORÍAS CENTRADAS) */}
      <nav className="m1-bottom-nav">
        <div className="m1-nav-inner">
          <button
            type="button"
            className={`m1-nav-item ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
            onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
          >
            Portada
          </button>

          {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
            <button
              key={cat}
              type="button"
              className={`m1-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
              onClick={() => setSelectedCategory && setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>
      {/* BANNER PUBLICITARIO 728x90 */}
      <div className="m1-ad-banner-container">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="m1-ad-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </a>
      </div>
    </header>
  );
}