import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import WeatherWidget from '../../WeatherWidget';
import './HeaderSaladas.css';

// SVG Íconos de Redes Sociales
const XIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const WhatsappIcon = () => (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.553 4.197 1.603 6.014L0 24l6.126-1.608a11.977 11.977 0 0 0 5.905 1.554h.005c6.645 0 12.03-5.385 12.03-12.031C24.066 5.385 18.676 0 12.031 0zm0 22.012h-.004a9.982 9.982 0 0 1-5.093-1.396l-.366-.217-3.784.992 1.01-3.688-.238-.379a9.973 9.973 0 0 1-1.534-5.3 9.99 9.99 0 0 1 9.998-9.998c2.67 0 5.18 1.04 7.068 2.928a9.932 9.932 0 0 1 2.928 7.068c0 5.513-4.485 9.999-9.986 9.999z"/>
  </svg>
);

export default function HeaderSaladas(props) {
  const dynamicCategories = props.dynamicCategories || props.categories || props.categorias || [];
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

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const fechaFormateada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

  return (
    <header className="saladas-header-exacto">
      {/* 1. SECCIÓN SUPERIOR */}
      <div className="saladas-top-bar">
        <div className="saladas-top-container">
          
          {/* IZQUIERDA: BUSCADOR + WEATHER WIDGET (SOLO TEXTO) */}
          <div className="saladas-left-box">
            <form className="saladas-search-box" onSubmit={manejarEnvioFormulario}>
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar noticias..." 
                value={terminoLocal}
                onChange={manejarCambioInput}
              />
            </form>
          </div>

          {/* CENTRO: LOGO + FECHA */}
          <div className="saladas-center-box">
            <Link to="/" onClick={() => setSelectedCategory && setSelectedCategory('Todas')}>
              <img 
                src="/img/logos/saladaslogo.png" 
                alt="Saladas Noticias" 
                className="saladas-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logos/saladas.png';
                }}
              />
            </Link>
            <div className="saladas-fecha-text">
              {fechaFormateada}
            </div>
          </div>

          {/* DERECHA: REDES SOCIALES */}
          <div className="saladas-right-box">
            <a href="https://x.com" target="_blank" rel="noreferrer" title="X"><XIcon /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook"><FacebookIcon /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram"><InstagramIcon /></a>
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" title="WhatsApp"><WhatsappIcon /></a>
          </div>

        </div>
      </div>

      {/* 2. BARRA DE NAVEGACIÓN DORADA */}
      <nav className="saladas-gold-nav">
        <div className="saladas-nav-container">
          {(dynamicCategories || []).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`saladas-gold-chip ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'activo' : ''}`}
              onClick={() => setSelectedCategory && setSelectedCategory(cat)}
            >
              {cat === 'Todas' ? 'PORTADA' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* 3. BANNER PUBLICITARIO */}
      <div className="saladas-banner-wrapper">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Gobierno de Corrientes" 
            className="saladas-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </a>
      </div>
    </header>
  );
}