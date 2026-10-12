import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderCorrientesNewsHoy.css';

export default function HeaderCorrientesNewsHoy(props) {
  const tenantKey = props.tenant || 'corrientesnewshoy';
  const infoMunicipio = municipios[tenantKey] || municipios.corrientesnewshoy;
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
      className="cnh-header-container"
      style={{
        '--cnh-purple': colores?.primary || '#5b21b6',
        '--cnh-purple-dark': colores?.secondary || '#4c1d95',
        '--cnh-pill-bg': colores?.accent || '#f3f4f6'
      }}
    >
      <div className="cnh-main-bar">
        <div className="cnh-main-inner">
          
          {/* LOGOTIPO E ISOTIPO */}
          <div className="cnh-brand-box">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              className="cnh-logo-link"
            >
              <img 
                src="/img/logos/isocorrientesnewshoy.png" 
                alt="Isotipo Corrientes News Hoy" 
                className="cnh-iso-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <img 
                src={logo || '/img/logos/corrientesnewshoy.png'} 
                alt={nombre || 'CORRIENTES NEWS HOY'} 
                className="cnh-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/corrientesnewshoy.png';
                }}
              />
            </Link>
          </div>

          {/* MENÚ ESTILO PÍLDORAS (PILLS) */}
          <nav className="cnh-nav">
            <div className="cnh-nav-inner">
              <button 
                type="button" 
                className={`cnh-nav-pill ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
                onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              >
                Inicio
              </button>

              {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cnh-nav-pill ${(selectedCategory || '').toLowerCase() === cat.toLowerCase() ? 'activo' : ''}`}
                  onClick={() => setSelectedCategory && setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </nav>

          {/* ACCIÓN DE BÚSQUEDA */}
          <div className="cnh-action-box">
            {mostrarBuscador ? (
              <form className="cnh-search-form" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={terminoLocal}
                  onChange={manejarCambioInput}
                  autoFocus
                />
                <button type="button" onClick={() => setMostrarBuscador(false)} className="cnh-close-btn">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                className="cnh-search-btn"
                onClick={() => setMostrarBuscador(true)}
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* BANNER PUBLICITARIO 728x90 */}
      <div className="cnh-banner-container">
        <a href="https://www.corrientes.gob.ar" target="_blank" rel="noopener noreferrer">
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="cnh-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>
    </header>
  );
}