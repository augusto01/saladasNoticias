import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../SeguiTuCorrientes/SeguiTuCorrientes.css';

export default function HeaderSeguiTuCorrientes(props) {
  // Soporta props pasadas de forma directa o desestructuradas dentro de headerProps
  const noticias = props.noticias || props.news || [];
  const onSelectCategory = props.onSelectCategory || props.onSelectCat || props.setCategory;
  const selectedCategory = props.selectedCategory || props.category || '';

  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

  // 1. Extraer categorías únicas desde MongoDB de forma robusta
  const categoriasDinamicas = useMemo(() => {
    if (!Array.isArray(noticias) || noticias.length === 0) return [];

    const lista = noticias
      .map((n) => n.categoria || n.cat || n.categoría)
      .filter((cat) => cat && typeof cat === 'string' && cat.trim() !== '');

    return Array.from(new Set(lista));
  }, [noticias]);

  // 2. Extraer tags/hashtags únicos desde MongoDB
  const etiquetasDinamicas = useMemo(() => {
    if (!Array.isArray(noticias) || noticias.length === 0) return [];

    const todosLosTags = noticias.flatMap((n) => n.tags || n.etiquetas || []);
    const unicos = Array.from(new Set(todosLosTags)).filter(Boolean);
    return unicos.slice(0, 6);
  }, [noticias]);

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (onSelectCategory && terminoBusqueda.trim()) {
      onSelectCategory(terminoBusqueda.trim());
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
              {etiquetasDinamicas.length > 0 ? (
                etiquetasDinamicas.map((tag, idx) => (
                  <button 
                    key={idx} 
                    className="tag-btn"
                    onClick={() => onSelectCategory && onSelectCategory(tag)}
                  >
                    #{String(tag).toUpperCase().replace(/\s+/g, '')}
                  </button>
                ))
              ) : (
                <span className="tag-estatico">#SEGUITUCORRIENTES</span>
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
          <Link to="/" className="segui-brand" onClick={() => onSelectCategory && onSelectCategory('')}>
            <img 
              src="/img/logos/01_Logotipo.png" 
              alt="Seguí Tu Corrientes" 
              className="segui-logo-img"
            />
          </Link>

          <div className="segui-acciones">
            {mostrarBuscador ? (
              <form className="segui-caja-busqueda" onSubmit={manejarBusqueda}>
                <input 
                  type="text" 
                  placeholder="Buscar noticia..." 
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  autoFocus
                />
                <button type="button" className="close-search" onClick={() => setMostrarBuscador(false)}>✕</button>
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

      {/* 3. NAVEGACIÓN Y FILTROS DINÁMICOS */}
      <nav className="segui-nav-bar">
        <div className="segui-nav-container">
          <button 
            className={`nav-chip ${!selectedCategory ? 'activo' : ''}`}
            onClick={() => onSelectCategory && onSelectCategory('')}
          >
            🏠 Todas las Noticias
          </button>

          {/* Renderizado dinámico de las categorías traídas de la base de datos */}
          <div className="segui-categorias-scroll">
            {categoriasDinamicas.map((cat, idx) => (
              <button
                key={idx}
                className={`nav-chip ${selectedCategory === cat ? 'activo' : ''}`}
                onClick={() => onSelectCategory && onSelectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}