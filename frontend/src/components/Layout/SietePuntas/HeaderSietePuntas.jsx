import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Star } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderSietePuntas.css';

export default function HeaderSietePuntas(props) {
  const tenantKey = props.tenant || 'sietepuntasnoticias';
  const infoMunicipio = municipios[tenantKey] || municipios.sietepuntasnoticias;
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
  }).toUpperCase();

  return (
    <header 
      className="spn-header-container"
      style={{
        '--spn-brown': colores?.primary || '#3b2314',
        '--spn-dark': colores?.secondary || '#1c1917',
        '--spn-bg': colores?.accent || '#f5f2eb'
      }}
    >
      {/* 1. TOP BAR EDITORIAL CORTADA POR LÍNEAS */}
      <div className="spn-top-bar">
        <div className="spn-top-inner">
          <div className="spn-top-col text-left">CORRIENTES, ARGENTINA</div>
          <div className="spn-top-col text-center">{fechaHoy}</div>
          <div className="spn-top-col text-right">EDICIÓN DIGITAL</div>
        </div>
      </div>

      {/* 2. ÁREA CENTRAL: ISOTIPO + LOGO + SLOGAN */}
      <div className="spn-main-bar">
        <div className="spn-main-inner">

          {/* BUSCADOR A LA IZQUIERDA */}
          <div className="spn-left-box">
            {mostrarBuscador ? (
              <form className="spn-search-form" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar en el diario..." 
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
                className="spn-search-btn"
                onClick={() => setMostrarBuscador(true)}
              >
                <Search size={18} />
                <span>BUSCAR</span>
              </button>
            )}
          </div>

          {/* CENTRO: ESTRELLA + LOGO */}
          <div className="spn-center-brand">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              className="spn-brand-link"
            >
              {/* ESTRELLA DE 5 PUNTAS / ISOTIPO */}
              <div className="spn-star-box">
                <img 
                  src="/img/logos/iso_sietepuntasnoticias.png" 
                  alt="Estrella Siete Puntas" 
                  className="spn-iso-img"
                  onError={(e) => {
                    // Fallback a ícono SVG si no existe la imagen
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Star size={28} className="spn-star-fallback" fill="#1c1917" style={{ display: 'none' }} />
              </div>

              {/* LOGO EN IMAGEN O TEXTO VINTAGE */}
              <img 
                src={logo || '/img/logos/sietepuntasnoticias.png'} 
                alt={nombre || 'SIETE PUNTAS NOTICIAS'} 
                className="spn-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />

              <div className="spn-text-logo-fallback" style={{ display: 'none' }}>
                <span className="spn-title-line">SIETE PUNTAS</span>
                <span className="spn-title-line">NOTICIAS</span>
              </div>

              <span className="spn-slogan">LA VERDAD DESDE LA COSTANERA AL MUNDO</span>
            </Link>
          </div>

          {/* DERECHA VACÍA PARA BALANCE */}
          <div className="spn-right-box"></div>

        </div>
      </div>

      {/* 3. BANNER PUBLICITARIO */}
      <div className="spn-ad-banner-container">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="spn-ad-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </a>
      </div>

      {/* 4. NAV DE CATEGORÍAS TIPO PERIÓDICO */}
      <nav className="spn-bottom-nav">
        <div className="spn-nav-inner">
          <button 
            type="button" 
            className={`spn-nav-item ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
            onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
          >
            PORTADA
          </button>

          {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
            <React.Fragment key={cat}>
              <span className="spn-nav-bullet">•</span>
              <button
                type="button"
                className={`spn-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
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