import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderElPortalDeItu.css';

export default function HeaderElPortalDeItu(props) {
  const tenantKey = props.tenant || 'elportaldeitu';
  const infoMunicipio = municipios[tenantKey] || municipios.elportaldeitu;
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

  return (
    <header 
      className="itu-header-container"
      style={{
        '--itu-gold': colores?.primary || '#d4af37',
        '--itu-green': colores?.secondary || '#032e1e'
      }}
    >
      {/* FRANJA PRINCIPAL VERDE BOTELLA */}
      <div className="itu-main-bar">
        <div className="itu-main-inner">
          
          {/* LADO IZQUIERDO: BUSCADOR */}
          <div className="itu-left-box">
            {mostrarBuscador ? (
              <form className="itu-search-form" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar en Ituzaingó..." 
                  value={terminoLocal}
                  onChange={manejarCambioInput}
                  autoFocus
                />
                <button type="button" onClick={() => setMostrarBuscador(false)} className="itu-close-btn">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                className="itu-search-btn"
                onClick={() => setMostrarBuscador(true)}
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* CENTRO: ARCO (ISOTIPO) + LOGOTIPO + SLOGAN */}
          <div className="itu-center-brand">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              className="itu-brand-link"
            >
              <img 
                src="/img/logos/iso_elportaldeitu.png" 
                alt="Arco de Ituzaingó" 
                className="itu-iso-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <img 
                src={logo || '/img/logos/elportaldeitu.png'} 
                alt={nombre || 'EL PORTAL DE ITU'} 
                className="itu-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/elportaldeitu.png';
                }}
              />
              <span className="itu-slogan">LAS NOTICIAS DE ITUZAINGÓ Y LA REGIÓN</span>
            </Link>
          </div>

          {/* LADO DERECHO: ESPACIO RESERVADO PARA BALANCE */}
          <div className="itu-right-box"></div>

        </div>

        {/* NAVEGACIÓN CENTRADA CON LÍNEA DIVISORIA */}
        <nav className="itu-nav">
          <div className="itu-nav-inner">
            <button 
              type="button" 
              className={`itu-nav-item ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
            >
              INICIO
            </button>

            {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
              <button
                key={cat}
                type="button"
                className={`itu-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
                onClick={() => setSelectedCategory && setSelectedCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* BANNER PUBLICITARIO */}
      <div className="itu-ad-banner-container">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="itu-ad-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </a>
      </div>
    </header>
  );
}