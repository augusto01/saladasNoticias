import React, { useState, useEffect } from 'react';
import { Search, Bell, Radio } from 'lucide-react';
import './HeaderSantaRosa.css';

export default function HeaderSantaRosa({
  configActual,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  dynamicCategories
}) {
  // Estados para datos dinámicos
  const [clima, setClima] = useState({ temp: '--', min: '--', max: '--' });
  const [dolar, setDolar] = useState({ oficial: '--', blue: '--' });

  // 1. Obtener Clima Dinámico de Santa Rosa (Open-Meteo API)
  useEffect(() => {
    const fetchClima = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-28.2618&longitude=-58.1182&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FArgentina%2FBuenos_Aires'
        );
        const data = await res.json();
        if (data && data.current_weather) {
          setClima({
            temp: Math.round(data.current_weather.temperature),
            min: Math.round(data.daily.temperature_2m_min[0]),
            max: Math.round(data.daily.temperature_2m_max[0])
          });
        }
      } catch (error) {
        console.error('Error al obtener clima de Santa Rosa:', error);
      }
    };

    fetchClima();
  }, []);

  // 2. Obtener Cotización del Dólar Dinámica (DolarApi)
  useEffect(() => {
    const fetchDolar = async () => {
      try {
        const [resOficial, resBlue] = await Promise.all([
          fetch('https://dolarapi.com/v1/dolares/oficial'),
          fetch('https://dolarapi.com/v1/dolares/blue')
        ]);
        const dataOficial = await resOficial.json();
        const dataBlue = await resBlue.json();

        setDolar({
          oficial: dataOficial?.venta ? `$${dataOficial.venta}` : '--',
          blue: dataBlue?.venta ? `$${dataBlue.venta}` : '--'
        });
      } catch (error) {
        console.error('Error al obtener cotización del dólar:', error);
      }
    };

    fetchDolar();
  }, []);

  return (
    <header className="santarosa-header-wrapper">
      
      {/* 1. BARRA PRINCIPAL BLANCA */}
      <div className="santarosa-main-bar container-fluid">
        
        {/* Izquierda: Buscador + Categorías principales */}
        <div className="santarosa-left-section">
          <div className="santarosa-search-box">
            <Search size={18} className="santarosa-search-icon" />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="santarosa-search-input"
            />
          </div>

          
        </div>

        {/* Centro: Logo SR Santa Rosa */}
        <div className="santarosa-center-logo">
          <a href="/" className="santarosa-logo-link">
            {configActual?.logo ? (
              <img src={configActual.logo} alt={configActual.nombre} className="santarosa-logo-img" />
            ) : (
              <div className="santarosa-tn-brand">
                <span className="sr-s-black">S</span>
                <span className="sr-r-red">R</span>
                <span className="sr-text-sub">SANTA ROSA</span>
              </div>
            )}
          </a>
        </div>

        {/* Derecha: Notificaciones y Badge EN VIVO Rojo */}
        <div className="santarosa-right-section">
          <button className="santarosa-icon-btn d-none d-sm-flex" title="Notificaciones">
            <Bell size={18} />
          </button>

          <div className="santarosa-live-badge">
            <Radio size={14} className="live-pulse" />
            <span>EN VIVO</span>
          </div>
        </div>

      </div>

      {/* 2. SUB-BARRA CON DATOS DINÁMICOS DE CLIMA Y DÓLAR */}
      <div className="santarosa-ticker-bar container-fluid">
        <div className="santarosa-ticker-container">
          
          {/* Cotizaciones y Clima Traídos de las APIs */}
          <div className="santarosa-rates-info">
            <span className="rate-item">Santa Rosa: <strong>{clima.temp} °C</strong> <small className="text-muted">({clima.min}° / {clima.max}°)</small></span>
            <span className="rate-divider">|</span>
            <span className="rate-item">Dólar Oficial: <strong>{dolar.oficial}</strong></span>
            <span className="rate-divider">|</span>
            <span className="rate-item">Blue: <strong className="text-danger">{dolar.blue}</strong></span>
          </div>

          <span className="rate-divider d-none d-md-inline">|</span>

          {/* Categorías / Temas de hoy */}
          <div className="santarosa-topics-list">
            <span className="topics-label">Temas de hoy:</span>
            <div className="topics-scroll">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`topic-chip ${selectedCategory.toUpperCase() === cat.toUpperCase() ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 3. BANNER INSTITUCIONAL A TODO EL ANCHO DE PANTALLA */}
      <div className="santarosa-full-width-banner">
        <a href="https://www.argentina.gob.ar" target="_blank" rel="noopener noreferrer">
          <img 
            src="/728x90publi_banner web.gif" 
            alt="Publicidad Institucional" 
            className="santarosa-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>

    </header>
  );
}