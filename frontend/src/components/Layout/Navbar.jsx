import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

// IMPORTACIÓN CONFIGURACIÓN DINÁMICA
import { configActual } from "../../config/municipios";

import "../../styles/Navbar.css";

// Definimos la lista base de links
const BASE_LINKS = [
  { label: "Noticias", path: "/" },
  { label: "Visítanos", path: "/ubicacion", soloSaladas: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();

  // Filtrar links según el municipio activo (solo muestra 'Visítanos' si es Saladas)
  const links = BASE_LINKS.filter(
    (link) => !link.soloSaladas || configActual.id === "saladas"
  );

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    handleClose();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        handleClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        
        {/* LOGO DINÁMICO */}
        <NavLink to="/" className="navbar-logo" onClick={handleClose}>
          <img
            src={configActual.logo}
            alt={`Logo ${configActual.portal}`}
            className="navbar-logo-img"
          />
        </NavLink>

        {/* BOTÓN MOBILE */}
        <button
          ref={buttonRef}
          type="button"
          className={`navbar-toggle ${isOpen ? "active" : ""}`}
          onClick={handleToggle}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <span className="navbar-toggle-icon">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </span>
        </button>

        {/* NAVEGACIÓN */}
        <nav
          ref={menuRef}
          className={`navbar-menu ${isOpen ? "open" : ""}`}
        >
          <ul className="navbar-links">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    isActive ? "navbar-link active" : "navbar-link"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </header>
  );
}