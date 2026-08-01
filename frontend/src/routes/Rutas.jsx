import { Routes, Route } from 'react-router-dom';

// Páginas principales
import Portada from '../components/pages/Portada';
import Noticias from '../components/pages/Noticias';
import Ejecutivo from '../components/pages/Ejecutivo';
import HCD from '../components/pages/Hcd';
import Boletines from '../components/pages/Boletines';
import CartaOrganica from '../components/pages/CartaOrganica';
import Ubicacion from '../components/pages/Ubicacion';
import Galeria from '../components/pages/Galeria';
import Contacto from '../components/pages/Contacto';

// Páginas de servicios
import Turnos from '../components/pages/Turnos';
import Entradas from '../components/pages/Entradas';

// Turismo / Cultura
import Museo from '../components/pages/Museo';
import Estudiantina from '../components/pages/Estudiantina';

// Carnavales y agrupaciones
import Carnavales from '../components/pages/Carnavales';
import Sambatuque from '../components/pages/comparsas/Sambatuque';
import CarismaShow from '../components/pages/comparsas/CarismaShow';
import Ibera from '../components/pages/comparsas/Ibera';
import Xango from '../components/pages/comparsas/Xango';

// Detalle de Noticia
import NoticiaDetalle from '../components/pages/NoticiaDetalle';

const Rutas = () => {
  return (
    <Routes>
      <Route path="/" element={<Portada />} />
      <Route path="/noticias" element={<Noticias />} />
      <Route path="/noticias/:id" element={<NoticiaDetalle />} />
      <Route path="/ejecutivo" element={<Ejecutivo />} />
      <Route path="/hcd" element={<HCD />} />
      <Route path="/boletines" element={<Boletines />} />
      <Route path="/carta-organica" element={<CartaOrganica />} />
      <Route path="/ubicacion" element={<Ubicacion />} />
      <Route path="/galeria" element={<Galeria />} />
      <Route path="/contacto" element={<Contacto />} />

      {/* Servicios */}
      <Route path="/turnos" element={<Turnos />} />
      <Route path="/entradas" element={<Entradas />} />

      {/* Turismo / Cultura */}
      <Route path="/museo" element={<Museo />} />
      <Route path="/estudiantina" element={<Estudiantina />} />

      {/* Carnavales y agrupaciones */}
      <Route path="/carnavales" element={<Carnavales />} />
      <Route path="/carnavales/sambatuque" element={<Sambatuque />} />
      <Route path="/carnavales/carisma" element={<CarismaShow />} />
      <Route path="/carnavales/ibera" element={<Ibera />} />
      <Route path="/carnavales/xango" element={<Xango />} />
    </Routes>
  );
};

export default Rutas;