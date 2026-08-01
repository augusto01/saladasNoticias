import { Link } from 'react-router-dom';
import '../styles/NewsList.css';


const NewsList = () => {
  const noticias = [
    {
      id: 1,
      titulo: "Festejos Patronales",
      resumen: "La ciudad se prepara para sus fiestas patronales...",
      fecha: "15 de julio de 2025",
      autor: "Municipalidad de Saladas",
      imagen: "/img/noticia1.webp",
    },
    {
      id: 2,
      titulo: "Obras en curso",
      resumen: "Se están realizando mejoras en la avenida central...",
      fecha: "14 de julio de 2025",
      autor: "Secretaría de Obras Públicas",
      imagen: "/img/noticia2.webp",
    },
  ];

  return (
    <div className="news-list container py-4">
      <h2 className="mb-4">Últimas Noticias</h2>
      {noticias.map((noticia) => (
        <div key={noticia.id} className="card mb-4 news-card shadow-sm">
          <div className="row g-0">
            <div className="col-md-4">
              <img src={noticia.imagen} className="img-fluid rounded-start h-100" alt={noticia.titulo} />
            </div>
            <div className="col-md-8">
              <div className="card-body d-flex flex-column justify-content-between h-100">
                <div>
                  <h5 className="card-title">{noticia.titulo}</h5>
                  <p className="card-text">{noticia.resumen}</p>
                </div>
                <div>
                  <p className="card-text">
                    <small className="text-muted">Publicado el {noticia.fecha} por {noticia.autor}</small>
                  </p>
                  <Link to={`/noticias/${noticia.id}`} className="btn btn-warning btn-sm fw-bold">
                    Leer más
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
