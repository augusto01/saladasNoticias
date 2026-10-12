import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { municipios } from '../../../config/municipios';
import './HeaderEnterateCorrientes.css';

export default function HeaderEnterateCorrientes(props) {
  const tenantKey = props.tenant || 'enteratecorrientes';
  const infoMunicipio = municipios[tenantKey] || municipios.enteratecorrientes;
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
      className="enterate-header-container"
      style={{
        '--enterate-magenta': colores?.primary || '#e60067',
        '--enterate-purple': colores?.secondary || '#4a0040'
      }}
    >
      {/* FRANJA PRINCIPAL PÚRPURA */}
      <div className="enterate-main-bar">
        <div className="enterate-main-inner">
          
          {/* LADO IZQUIERDO: BUSCADOR */}
          <div className="enterate-left-box">
            {mostrarBuscador ? (
              <form className="enterate-search-form" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar tendencia..." 
                  value={terminoLocal}
                  onChange={manejarCambioInput}
                  autoFocus
                />
                <button type="button" onClick={() => setMostrarBuscador(false)}>
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button 
                type="button" 
                className="enterate-icon-btn"
                onClick={() => setMostrarBuscador(true)}
                aria-label="Buscar"
              >
                <Search size={22} />
              </button>
            )}
          </div>

          {/* CENTRO: ISOTIPO + LOGOTIPO */}
          <div className="enterate-center-logo">
            <Link 
              to="/" 
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
              className="enterate-logo-link"
            >
              <img 
                src="/img/logos/iso_enteratecorrientes.png" 
                alt="Isotipo Enterate Corrientes" 
                className="enterate-iso-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <img 
                src={logo || '/img/logos/enteratecorrienteslogo.png'} 
                alt={nombre || 'ENTERATE CORRIENTES'} 
                className="enterate-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/enteratecorrienteslogo.png';
                }}
              />
            </Link>
          </div>

          {/* LADO DERECHO: ESPACIO RESERVADO PARA BALANCE */}
          <div className="enterate-right-box"></div>

        </div>

        {/* NAVEGACIÓN CENTRADA Y RESPONSIVA */}
        <nav className="enterate-nav">
          <div className="enterate-nav-inner">
            <button 
              type="button" 
              className={`enterate-nav-item ${(selectedCategory || 'Todas') === 'Todas' ? 'activo' : ''}`}
              onClick={() => setSelectedCategory && setSelectedCategory('Todas')}
            >
              INICIO
            </button>

            {safeCategories.filter(cat => cat !== 'Todas').map((cat) => (
              <button
                key={cat}
                type="button"
                className={`enterate-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
                onClick={() => setSelectedCategory && setSelectedCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* BANNER PUBLICITARIO 728x90 */}
      <div className="enterate-ad-banner-container">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad institucional" 
            className="enterate-ad-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </a>
      </div>
    </header>
  );
}