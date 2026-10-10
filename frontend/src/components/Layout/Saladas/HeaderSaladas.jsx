import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './HeaderSaladas.css';

export default function HeaderSaladas({
  configActual,
  searchTerm = '',
  setSearchTerm = () => {},
  selectedCategory = 'Todas',
  setSelectedCategory = () => {},
  dynamicCategories = ['Todas', 'POLICIALES', 'SOCIEDAD', 'DEPORTES', 'POLITICA']
}) {
  // Estado para el clima dinámico de Saladas
  const [clima, setClima] = useState({ temp: '--', min: '--', max: '--' });

  // Petición a la API de Open-Meteo para obtener datos en tiempo real
  useEffect(() => {
    const fetchClimaSaladas = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-28.2539&longitude=-58.7602&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FArgentina%2FBuenos_Aires'
        );
        const data = await res.json();
        
        if (data && data.current_weather && data.daily) {
          setClima({
            temp: Math.round(data.current_weather.temperature),
            min: Math.round(data.daily.temperature_2m_min[0]),
            max: Math.round(data.daily.temperature_2m_max[0])
          });
        }
      } catch (error) {
        console.error('Error al obtener el clima de Saladas:', error);
      }
    };

    fetchClimaSaladas();
  }, []);

  // Fecha actual formateada
  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const fechaFormateada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

  return (
    <header className="saladas-header-wrapper">
      
      {/* 1. BARRA SUPERIOR (Buscador + Clima Real + Logo/Fecha + Redes) */}
      <div className="saladas-top-bar container-fluid">
        
        {/* Izquierda: Buscador + Widget de Clima Dinámico */}
        <div className="saladas-top-left">
          <div className="saladas-search-btn-box">
            <Search size={18} className="saladas-search-icon" />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="saladas-search-input"
            />
          </div>

          <div className="saladas-weather-box">
            <div className="saladas-weather-main">
              <strong>Saladas</strong> <span>{clima.temp} °C</span>
            </div>
            <div className="saladas-weather-sub">
              MIN. {clima.min} °C MAX. {clima.max} °C
            </div>
          </div>
        </div>

        {/* Centro: Logo Oficial de Saladas + Fecha */}
        <div className="saladas-top-center">
          <a href="/" className="saladas-logo-link">
            {configActual?.logo ? (
              <img src={configActual.logo} alt={configActual.nombre} className="saladas-logo-img" />
            ) : (
              <div className="saladas-brand-fallback">
                <h1 className="saladas-brand-title">SALADAS <span>NOTICIAS</span></h1>
                <span className="saladas-brand-sub">{configActual?.slogan || 'Cuna de Héroes'}</span>
              </div>
            )}
          </a>
          <div className="saladas-date-text">{fechaFormateada}</div>
        </div>

        {/* Derecha: Redes Sociales */}
        <div className="saladas-top-right d-none d-lg-flex">
          <a href={configActual?.redes?.twitter || '#'} target="_blank" rel="noreferrer" title="X (Twitter)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href={configActual?.redes?.facebook || '#'} target="_blank" rel="noreferrer" title="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href={configActual?.redes?.instagram || '#'} target="_blank" rel="noreferrer" title="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href={configActual?.redes?.whatsapp || '#'} target="_blank" rel="noreferrer" title="WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          </a>
        </div>

      </div>

      {/* 2. NAVBAR INFERIOR AMARILLO */}
      <nav className="saladas-nav-bar">
        <div className="container-fluid d-flex align-items-center justify-content-between overflow-x-auto">
          <div className="saladas-nav-list">
            {(dynamicCategories || []).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`saladas-nav-item ${(selectedCategory || '').toUpperCase() === cat.toUpperCase() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'Todas' ? 'PORTADA' : cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. BANNER INSTITUCIONAL FULL WIDTH */}
      <div className="saladas-full-width-banner">
        <a href="https://www.argentina.gob.ar" target="_blank" rel="noopener noreferrer">
          <img 
            src="/728x90publi_banner web.gif" 
            alt="Publicidad Institucional" 
            className="saladas-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>

    </header>
  );
}