import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Navbar from './components/Layout/Navbar';
import Rutas from './routes/Rutas';
import SponsorsCarousel from './components/Layout/SponsorsCarousel';
import Footer from './components/Layout/Footer';

// CONFIGURACIÓN DINÁMICA DE MUNICIPIOS
import { configActual } from './config/municipios';

import './App.css'; // Estilos globales

function App() {
  useEffect(() => {
    // Inyecta los colores del municipio activo en las variables de CSS globales
    document.documentElement.style.setProperty('--color-primary', configActual.colorPrimario);
    document.documentElement.style.setProperty('--color-primary-hover', configActual.colorSecundario);
    document.documentElement.style.setProperty('--color-accent', configActual.colorAccento);
  }, []);

  return (
    <BrowserRouter>
      {/* METADATOS DINÁMICOS POR MUNICIPIO */}
      <Helmet>
        <title>{configActual.portal || "Portal Municipal"}</title>
        <link 
          rel="icon" 
          type="image/png" 
          href={configActual.favicon || configActual.logo} 
        />
      </Helmet>

      {/* w-100 asegura todo el ancho, min-vh-100 todo el alto */}
      <div className="d-flex flex-column min-vh-100 w-100">
        <Navbar />
        
        {/* Contenido principal flex-grow-1 empuja el footer hacia abajo */}
        <main className="flex-grow-1 w-100">
          <Rutas />
        </main>

        {/* <SponsorsCarousel /> */}
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;