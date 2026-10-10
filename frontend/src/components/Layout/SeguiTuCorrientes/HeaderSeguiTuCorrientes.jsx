import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { configActual } from '../../../config/municipios';
import '../SeguiTuCorrientes/SeguiTuCorrientes.css';

export default function HeaderSeguiTuCorrientes(props) {
  const dynamicCategories = props.dynamicCategories || props.categories || props.categorias || [];
  const selectedCategory = props.selectedCategory || props.category || props.categoria || '';
  const setSelectedCategory = props.setSelectedCategory || props.onSelectCategory || props.setCategory;
  const tags = props.tags || props.etiquetas || [];
  
  // Función para enviar el término de búsqueda al estado principal
  const onSearch = props.onSearch || props.setSearchTerm || props.handleSearch;

  const [terminoLocal, setTerminoLocal] = useState(props.searchTerm || '');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

  // Propiedades obtenidas de la configuración del municipio o valores genéricos de la marca
  const logoHeader = configActual?.logo || '/img/logos/01_Logotipo.png';
  const nombreSitio = configActual?.nombre || 'Seguí Tu Corrientes';
  const hashtagBase = configActual?.id ? `#${configActual.id.toUpperCase()}` : '#SEGUITUCORRIENTES';

  // Manejador en tiempo real mientras el usuario escribe
  const manejarCambioInput = (e) => {
    const valor = e.target.value;
    setTerminoLocal(valor);
    if (onSearch) {
      onSearch(valor);
    }
  };

  const manejarEnvioFormulario = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(terminoLocal);
    }
  };

  const limpiarBusqueda = () => {
    setTerminoLocal('');
    setMostrarBuscador(false);
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <header className="segui-header-compacto">
      {/* 1. BARRA SUPERIOR: Tendencias (Hashtags) y Fecha */}
      <div className="segui-top-bar">
        <div className="segui-top-container">
          <div className="segui-tendencias">
            <span className="segui-badge-fuego">🔥 TENDENCIAS</span>
            <div className="segui-hashtags">
              {tags && tags.length > 0 ? (
                tags.map((tag) => (
                  <button 
                    key={tag} 
                    type="button"
                    className="tag-btn"
                    onClick={() => setSelectedCategory && setSelectedCategory(tag)}
                  >
                    #{String(tag).toUpperCase().replace(/\s+/g, '')}
                  </button>
                ))
              ) : (
                <span className="tag-estatico">{hashtagBase}</span>
              )}
            </div>
          </div>
          <div className="segui-fecha">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* 2. HEADER PRINCIPAL */}
      <div className="segui-main-bar">
        <div className="segui-main-container">
          <Link to="/" className="segui-brand" onClick={() => setSelectedCategory && setSelectedCategory('Todas')}>
            <img 
              src={logoHeader} 
              alt={nombreSitio} 
              className="segui-logo-img"
            />
          </Link>

          <div className="segui-acciones">
            {mostrarBuscador ? (
              <form className="segui-caja-busqueda" onSubmit={manejarEnvioFormulario}>
                <input 
                  type="text" 
                  placeholder="Buscar noticia..." 
                  value={terminoLocal}
                  onChange={manejarCambioInput}
                  autoFocus
                />
                <button type="submit" className="btn-ejecutar-busqueda">🔍</button>
                <button type="button" className="close-search" onClick={limpiarBusqueda}>✕</button>
              </form>
            ) : (
              <button className="action-btn" onClick={() => setMostrarBuscador(true)} title="Buscar">
                🔍 <span className="btn-texto">Buscar</span>
              </button>
            )}

            <div className="segui-en-vivo">
              <span className="puntos-vivo"></span>
              <span className="texto-vivo">EN VIVO</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE NAVEGACIÓN Y FILTRADO DINÁMICO */}
      <nav className="segui-nav-bar">
        <div className="container-fluid d-flex align-items-center justify-content-between overflow-x-auto">
          <div className="segui-nav-list">
            {(dynamicCategories || []).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`nav-chip ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
                onClick={() => setSelectedCategory && setSelectedCategory(cat)}
              >
                {cat === 'Todas' ? 'PORTADA' : cat}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}