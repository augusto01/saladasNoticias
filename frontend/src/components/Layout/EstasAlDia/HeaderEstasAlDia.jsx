import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, AlertCircle } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderEstasAlDia.css';

export default function HeaderEstasAlDia(props) {
  const tenantKey = props.tenant || 'estasaldiactes';
  const infoMunicipio = municipios[tenantKey] || municipios.estasaldiactes;
  const { colores, logo, nombre } = infoMunicipio;

  const dynamicCategories = props.dynamicCategories || props.categories || props.categorias || [];
  const safeCategories = Array.isArray(dynamicCategories) ? dynamicCategories : [];

  const selectedCategory = props.selectedCategory || props.category || props.categoria || '';
  const setSelectedCategory = props.setSelectedCategory || props.onSelectCategory || props.setCategory;

  const onSearch = props.onSearch || props.setSearchTerm || props.handleSearch;
  const [terminoLocal, setTerminoLocal] = useState(props.searchTerm || '');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

  // NOTICIAS DINÁMICAS: Filtrado y ordenamiento por fecha reciente
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

  return (
    <header 
      className="ead-header-container"
      style={{
        '--ead-blue': colores?.primary || '#1d4ed8',
        '--ead-dark': colores?.secondary || '#1e293b',
        '--ead-red': colores?.accent || '#ef4444'
      }}
    >
      {/* BARRA PRINCIPAL */}
      <div className="ead-main-bar">
        <div className="ead-main-inner">
          
          {/* LOGOTIPOS */}
          <div className="ead-brand-box">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              className="ead-logo-link"
            >
              <img 
                src="/img/logos/iso_estasaldiactes.png" 
                alt="Isotipo Estás al Día" 
                className="ead-iso-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <img 
                src={logo || '/img/logos/estasaldiactes.png'} 
                alt={nombre || 'ESTÁS AL DÍA CTES'} 
                className="ead-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/estasaldiacorrientes.png';
                }}
              />
            </Link>
          </div>

          {/* MENÚ DE CATEGORÍAS */}
          <nav className="ead-nav">
            <div className="ead-nav-inner">
              <button 
                type="button" 
                className={`ead-nav-item ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
                onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              >
                PORTADA
              </button>

              {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`ead-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
                  onClick={() => setSelectedCategory && setSelectedCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </nav>

          {/* BUSCADOR */}
          <div className="ead-action-box">
            {mostrarBuscador ? (
              <form className="ead-search-form" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar noticias..." 
                  value={terminoLocal}
                  onChange={manejarCambioInput}
                  autoFocus
                />
                <button type="button" onClick={() => setMostrarBuscador(false)} className="ead-close-btn">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                className="ead-search-btn"
                onClick={() => setMostrarBuscador(true)}
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* BARRA DE URGENTE 100% DINÁMICA */}
      <div className="ead-alert-bar">
        <div className="ead-alert-inner">
          <div className="ead-alert-label">
            <AlertCircle size={14} />
            <span>URGENTE</span>
          </div>
          <div className="ead-alert-marquee">
            <div className="ead-marquee-track">
              {ultimasNoticias.length > 0 ? (
                ultimasNoticias.map((news, idx) => (
                  <span key={news._id || news.id || idx} className="ead-marquee-item">
                    <Link to={`/noticias/${news._id || news.id}`}>
                      {news.titulo || news.title}
                    </Link>
                    {idx < ultimasNoticias.length - 1 && <span className="ead-bullet">|</span>}
                  </span>
                ))
              ) : (
                <span className="ead-marquee-item">
                  Cargando noticias urgentes...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BANNER PUBLICITARIO */}
      <div className="ead-banner-container">
        <a href="https://www.corrientes.gob.ar" target="_blank" rel="noopener noreferrer">
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="ead-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>
    </header>
  );
}