import React from 'react';
import { configActual } from '../../config/municipios';
import '../../styles/NewsHeroWithBanner.css';

const COLOR_MAP = {
  santarosa: '#ef4444',
  corrientes: '#16a34a',
  ituzaingo: '#2563eb',
  saladas: '#ca8a04',
};

export const NewsHeroWithBanner = () => {
  const municipioId = (configActual?.id || '').toLowerCase().trim();
  const primaryColor = COLOR_MAP[municipioId] || '#0284c7';

  const fechaActual = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section 
      className="news-hero-extended" 
      style={{ '--municipio-color': primaryColor }}
    >
      <div className="news-hero-container">
        
        <div className="hero-main-card">
          
          <div className="hero-header-row">
            <div className="hero-brand-group">
              {configActual?.logo && (
                <img 
                  src={configActual.logo} 
                  alt={`Logo de ${configActual?.nombre || 'Municipio'}`} 
                  className="hero-municipality-logo-large"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>

            <div className="hero-meta-group">
           
              <time className="hero-date">{fechaActual}</time>
            </div>
          </div>

          <div className="hero-text-block">
            
            
            <p className="hero-subtitle">
              {configActual?.descripcion ||
                'Información actualizada, avisos oficiales e información de interés público.'}
            </p>
          </div>
        </div>

        <div className="hero-ad-inside-container">
          <div className="hero-ad-box">
            <img 
              src="/728x90publi_banner web.gif" 
              alt="Publicidad institucional Gobierno de Corrientes" 
              className="ad-banner-crisp-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default NewsHeroWithBanner;