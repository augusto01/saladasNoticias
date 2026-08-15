import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Rutas from './routes/Rutas';
import SponsorsCarousel from './components/layout/SponsorsCarousel';
import Footer from './components/layout/Footer';
import './App.css'; // Asegúrate de importar los estilos globales

function App() {
  return (
    <BrowserRouter>
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