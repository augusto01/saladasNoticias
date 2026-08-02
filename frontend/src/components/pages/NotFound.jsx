import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import "../../styles/NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="notfound-container">
      <div className="notfound-card">
        {/* Ícono animado / Badge */}
        <div className="notfound-icon-wrapper">
          <AlertCircle size={48} className="notfound-icon" />
        </div>

        {/* Código de error */}
        <h1 className="notfound-code">404</h1>

        {/* Mensaje principal */}
        <h2 className="notfound-title">Página no encontrada</h2>
        <p className="notfound-description">
          Lo sentimos, la página que estás buscando no existe o fue movida.
        </p>

        {/* Botones de acción */}
        <div className="notfound-actions">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="notfound-btn notfound-btn-secondary"
          >
            <ArrowLeft size={18} />
            Volver atrás
          </button>

          <Link to="/" className="notfound-btn notfound-btn-primary">
            <Home size={18} />
            Ir a Noticias
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;