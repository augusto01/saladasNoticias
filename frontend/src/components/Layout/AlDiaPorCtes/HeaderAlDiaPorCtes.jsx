import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderAlDiaPorCtes.css';

export default function HeaderAlDiaPorCtes(props) {
  const tenantKey = props.tenant || 'aldiaporctes';
  const infoMunicipio = municipios[tenantKey] || municipios.aldiaporctes;
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
      className="adc-header-container"
      style={{
        '--adc-orange': colores?.primary || '#ea580c',
        '--adc-dark': colores?.secondary || '#18181b'
      }}
    >
      {/* 1. BARRA SUPERIOR: LOGOS + CATEGORÍAS + BUSCADOR */}
      <div className="adc-main-bar">
        <div className="adc-main-inner">
          
          {/* LOGOTIPO E ISOTIPO */}
          <div className="adc-brand-box">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              className="adc-logo-link"
            >
              <img 
                src="/img/logos/iso_aldiaporcorrientes.png" 
                alt="Isotipo Al Día" 
                className="adc-iso-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <img 
                src={logo || '/img/logos/aldiaporcorrienteslogo.png'} 
                alt={nombre || 'AL DÍA POR CTES'} 
                className="adc-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/aldiaporcorrienteslogos.png';
                }}
              />
            </Link>
          </div>

          {/* MENÚ DE CATEGORÍAS */}
          <nav className="adc-nav">
            <div className="adc-nav-inner">
              <button 
                type="button" 
                className={`adc-nav-item ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
                onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              >
                INICIO
              </button>

              {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`adc-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
                  onClick={() => setSelectedCategory && setSelectedCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </nav>

          {/* ACCIÓN DE BÚSQUEDA */}
          <div className="adc-action-box">
            {mostrarBuscador ? (
              <form className="adc-search-form" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={terminoLocal}
                  onChange={manejarCambioInput}
                  autoFocus
                />
                <button type="button" onClick={() => setMostrarBuscador(false)} className="adc-close-btn">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                className="adc-search-btn"
                onClick={() => setMostrarBuscador(true)}
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. MARQUESINA NEGRA CON BORDE INFERIOR NARANJA (DINÁMICA) */}
      <div className="adc-ticker-bar">
        <div className="adc-ticker-inner">
          <div className="adc-ticker-content">
            <div className="adc-ticker-track">
              {ultimasNoticias && ultimasNoticias.length > 0 ? (
                ultimasNoticias.map((news, idx) => (
                  <span key={news._id || news.id || idx} className="adc-ticker-item">
                    <span className="adc-ticker-dot">•</span>
                    <Link to={`/noticias/${news._id || news.id}`}>
                      {(news.titulo || news.title || '').toUpperCase()}
                    </Link>
                  </span>
                ))
              ) : (
                <span className="adc-ticker-item">
                  <span className="adc-ticker-dot">•</span>
                  <span>CARGANDO ÚLTIMAS NOTICIAS...</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BANNER PUBLICITARIO */}
      <div className="adc-banner-container">
        <a href="https://www.corrientes.gob.ar" target="_blank" rel="noopener noreferrer">
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="adc-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>
    </header>
  );
}