import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Cpu } from 'lucide-react';
import './HeaderCorrientes.css';

export default function HeaderCorrientes({
  configActual,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  dynamicCategories
}) {
  const [clima, setClima] = useState({ temp: '--' });

  // Clima Dinámico para Corrientes Capital (Open-Meteo: Lat -27.4692, Lon -58.8306)
  useEffect(() => {
    const fetchClimaCorrientes = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-27.4692&longitude=-58.8306&current_weather=true&timezone=America%2FArgentina%2FBuenos_Aires'
        );
        const data = await res.json();
        if (data && data.current_weather) {
          setClima({ temp: Math.round(data.current_weather.temperature) });
        }
      } catch (error) {
        console.error('Error al obtener clima de Corrientes:', error);
      }
    };

    fetchClimaCorrientes();
  }, []);

  return (
    <header className="corrientes-header-wrapper">
      
      {/* 1. BARRA DE NOTIFICACIÓN FINO SUPERIOR */}
      <div className="corrientes-top-banner">
        <div className="container-fluid text-center text-white small d-flex justify-content-center align-items-center gap-2">
          <span className="badge-sparkle"><Sparkles size={12} /> Smart City</span>
          <span>Corrientes Capital — Clima actual: <strong>{clima.temp}°C</strong> | Reclamos y Servicios 24hs</span>
        </div>
      </div>

      {/* 2. NAVBAR PRINCIPAL VERDE MÁS CLARO Y VISIBLE */}
      <div className="corrientes-main-nav container-fluid">
        
        {/* Logo */}
        <div className="corrientes-logo-box">
          <a href="/" className="corrientes-logo-link">
            {configActual?.logo ? (
              <img src={configActual.logo} alt={configActual.nombre} className="corrientes-logo-img" />
            ) : (
              <div className="corrientes-brand-tech">
                <Cpu size={24} className="brand-icon" />
                <span className="brand-title">CORRIENTES</span>
                <span className="brand-tag">NEWS</span>
              </div>
            )}
          </a>
        </div>

        {/* Categorías Dinámicas en Cápsulas */}
        <nav className="corrientes-pills-nav d-none d-md-flex">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`corrientes-pill-btn ${selectedCategory.toUpperCase() === cat.toUpperCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'Todas' ? 'Todas' : cat}
            </button>
          ))}
        </nav>

        {/* BUSCADOR Y BOTÓN CON LA MISMA ALTURA (38px) */}
        <div className="corrientes-actions-box">
          <div className="corrientes-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          
        </div>

      </div>

      {/* 3. NAVEGACIÓN MOBILE EN CÁPSULAS */}
      <div className="corrientes-mobile-pills d-md-none container-fluid">
        {dynamicCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`corrientes-pill-btn ${selectedCategory.toUpperCase() === cat.toUpperCase() ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. BANNER INSTITUCIONAL A TODO EL ANCHO DE PANTALLA */}
      <div className="corrientes-full-width-banner">
        <a href="https://www.argentina.gob.ar" target="_blank" rel="noopener noreferrer">
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad Institucional" 
            className="corrientes-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>

    </header>
  );
}