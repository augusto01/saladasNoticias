import React, { useState, useEffect } from 'react';
import { Search, Menu, Sun } from 'lucide-react';
import './HeaderItuzaingo.css';

export default function HeaderItuzaingo({
  configActual,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  dynamicCategories
}) {
  // Estados para datos dinámicos (Clima de Ituzaingó y Cotización Dólar)
  const [clima, setClima] = useState({ temp: '--' });
  const [dolar, setDolar] = useState({
    oficial: '--',
    blue: '--',
    tarjeta: '--',
    ccl: '--',
    mep: '--'
  });
  const [fechaHora, setFechaHora] = useState('');

  // 1. Clima Dinámico para Ituzaingó, Corrientes (Open-Meteo: Lat -27.588, Lon -56.681)
  useEffect(() => {
    const fetchClimaItuzaingo = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-27.588&longitude=-56.681&current_weather=true&timezone=America%2FArgentina%2FBuenos_Aires'
        );
        const data = await res.json();
        if (data && data.current_weather) {
          setClima({ temp: Math.round(data.current_weather.temperature) });
        }
      } catch (error) {
        console.error('Error al obtener clima de Ituzaingó:', error);
      }
    };

    fetchClimaItuzaingo();
  }, []);

  // 2. Cotización Dólar Dinámica (DolarApi)
  useEffect(() => {
    const fetchDolares = async () => {
      try {
        const [resOficial, resBlue, resTarjeta, resCcl, resMep] = await Promise.all([
          fetch('https://dolarapi.com/v1/dolares/oficial'),
          fetch('https://dolarapi.com/v1/dolares/blue'),
          fetch('https://dolarapi.com/v1/dolares/tarjeta'),
          fetch('https://dolarapi.com/v1/dolares/contadoconliqui'),
          fetch('https://dolarapi.com/v1/dolares/bolsa')
        ]);

        const [oficial, blue, tarjeta, ccl, mep] = await Promise.all([
          resOficial.json(),
          resBlue.json(),
          resTarjeta.json(),
          resCcl.json(),
          resMep.json()
        ]);

        setDolar({
          oficial: oficial?.venta ? `$${oficial.venta}` : '--',
          blue: blue?.venta ? `$${blue.venta}` : '--',
          tarjeta: tarjeta?.venta ? `$${tarjeta.venta}` : '--',
          ccl: ccl?.venta ? `$${ccl.venta}` : '--',
          mep: mep?.venta ? `$${mep.venta}` : '--'
        });
      } catch (error) {
        console.error('Error al obtener dólares:', error);
      }
    };

    fetchDolares();
  }, []);

  // 3. Hora y Fecha actual
  useEffect(() => {
    const updateFechaHora = () => {
      const ahora = new Date();
      const dia = ahora.toLocaleDateString('es-AR', { weekday: 'short' });
      const diaNombre = dia.charAt(0).toUpperCase() + dia.slice(1);
      const fechaNum = ahora.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric', year: 'numeric' });
      const hora = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
      setFechaHora(`${diaNombre} ${fechaNum} ${hora}`);
    };

    updateFechaHora();
    const timer = setInterval(updateFechaHora, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="ituzaingo-header-wrapper">
      
      {/* 1. BARRA PRINCIPAL AZUL CON BORDE NARANJA */}
      <div className="ituzaingo-main-bar container-fluid">
        
        {/* Izquierda: Menú + Búsqueda + Redes */}
        <div className="ituzaingo-left-box">
         

          <div className="ituzaingo-search-box">
            <Search size={18} className="ituzaingo-search-icon" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ituzaingo-search-input"
            />
          </div>

          {/* Bloque de Redes Sociales */}
          <div className="ituzaingo-social-grid d-none d-md-grid">
            <a href={configActual?.redes?.facebook || '#'} target="_blank" rel="noreferrer" title="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={configActual?.redes?.instagram || '#'} target="_blank" rel="noreferrer" title="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href={configActual?.redes?.twitter || '#'} target="_blank" rel="noreferrer" title="X (Twitter)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href={configActual?.redes?.youtube || '#'} target="_blank" rel="noreferrer" title="YouTube">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Centro: Logo estilo CtesHoy */}
        <div className="ituzaingo-center-logo">
          <a href="/" className="ituzaingo-logo-link">
            {configActual?.logo ? (
              <img src={configActual.logo} alt={configActual.nombre} className="ituzaingo-logo-img" />
            ) : (
              <div className="ituzaingo-ctes-brand">
                <span className="brand-text">ITUZAINGÓ</span>
                <span className="brand-badge">hoy<small>.com</small></span>
              </div>
            )}
          </a>
        </div>

        {/* Derecha: Clima + Fecha y Hora */}
        <div className="ituzaingo-right-info">
          <div className="ituzaingo-weather-item">
            <Sun size={26} className="sun-icon" />
            <span className="weather-temp">{clima.temp}°C</span>
          </div>
          <div className="ituzaingo-date-time d-none d-sm-block">
            {fechaHora}
          </div>
        </div>

      </div>

      {/* 2. SUB-BARRA DE COTIZACIONES DE DÓLAR DINÁMICAS */}
      <div className="ituzaingo-rates-bar container-fluid">
        <div className="ituzaingo-rates-scroll">
          <span className="rate-pill"><strong>Dólar oficial</strong> {dolar.oficial}</span>
          <span className="rate-pill"><strong>Dólar blue</strong> {dolar.blue}</span>
          <span className="rate-pill"><strong>Dólar tarjeta</strong> {dolar.tarjeta}</span>
          <span className="rate-pill"><strong>Dólar CCL</strong> {dolar.ccl}</span>
          <span className="rate-pill"><strong>Dólar MEP</strong> {dolar.mep}</span>
        </div>
      </div>

      {/* 3. BARRA DE CATEGORÍAS Y NAVEGACIÓN */}
      <nav className="ituzaingo-nav-bar">
        <div className="container-fluid d-flex align-items-center justify-content-between overflow-x-auto">
          <div className="ituzaingo-nav-list">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`ituzaingo-nav-item ${selectedCategory.toUpperCase() === cat.toUpperCase() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'Todas' ? 'PORTADA' : cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. BANNER INSTITUCIONAL FULL WIDTH */}
      <div className="ituzaingo-full-width-banner">
        <a href="https://www.argentina.gob.ar" target="_blank" rel="noopener noreferrer">
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad Institucional" 
            className="ituzaingo-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>

    </header>
  );
}