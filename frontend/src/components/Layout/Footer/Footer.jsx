import React from 'react';
import './Footer.css';

export default function Footer({ tenantInfo }) {
  const currentYear = new Date().getFullYear();
  const nombrePortal = tenantInfo?.nombre || 'Portal de Noticias';

  return (
    <footer className="portal-footer">
      {/* BANNER PUBLICITARIO / INSTITUCIONAL DEL GOBIERNO */}
      <div className="footer-banner-container">
        <a 
          href="https://www.corrientes.gob.ar" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Gobierno de la Provincia de Corrientes"
        >
          <img 
            src="/728x90publi_bannerweb.gif" 
            alt="Publicidad Institucional - Gobierno de Corrientes" 
            className="footer-banner-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </a>
      </div>

      {/* COPYRIGHT / CRÉDITOS */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p>© {currentYear} <strong>{nombrePortal}</strong>. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}