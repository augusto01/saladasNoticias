import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import '../styles/NewsList.css';

const CATEGORIES = ["Todas", "GESTIÓN", "CULTURA", "SALUD", "DEPORTES", "OBRAS"];

const MAIN_NEWS = {
  id: 1,
  category: "GESTIÓN",
  title: "Avanzan las obras de pavimentación y bacheo en el casco urbano",
  summary: "El municipio continúa ejecutando el plan de infraestructura vial para mejorar la transitabilidad y la seguridad en los principales barrios de la ciudad.",
  date: "1 de Agosto, 2026",
  image: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
};

const INITIAL_NEWS = [
  {
    id: 2,
    category: "CULTURA",
    title: "Se anuncia la agenda para el Festival Cultural del Fin de Semana",
    summary: "Artistas locales e internacionales se darán cita en la plaza central con acceso libre y gratuito.",
    date: "1 de Agosto, 2026",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    category: "SALUD",
    title: "Operativo de vacunación itinerante recorrerá los centros comunitarios",
    summary: "Se aplicarán vacunas del calendario nacional y antigripal de forma gratuita.",
    date: "31 de Julio, 2026",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    category: "DEPORTES",
    title: "Apertura de inscripciones para los Torneos Municipales de Verano",
    summary: "Fútbol, básquet y voley de playa contarán con categorías infantiles y de adultos.",
    date: "30 de Julio, 2026",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    category: "OBRAS",
    title: "Nueva iluminación LED en la avenida costanera para potenciar el turismo",
    summary: "Se colocaron más de 200 luminarias de última tecnología con menor consumo energético.",
    date: "29 de Julio, 2026",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80",
  }
];

const POPULAR_NEWS = [
  { id: 101, title: "Cronograma de recolección de residuos durante el feriado" },
  { id: 102, title: "Nuevos cursos gratuitos con certificación en la Escuela de Oficios" },
  { id: 103, title: "Descuentos en pago anual anticipado de tasas municipales" },
];

export default function NewsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredNews = INITIAL_NEWS.filter((item) => {
    const matchesCategory =
      selectedCategory === "Todas" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="news-container">
      
      {/* BANNER INSTITUCIONAL */}

      {/* FILTROS Y BÚSQUEDA */}
      <section className="news-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar noticias u obras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          <Filter size={16} className="filter-icon" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* GRILLA PRINCIPAL */}
      <div className="news-grid">
        
        <section className="news-main-column">
          
          {/* NOTICIA PRINCIPAL (LINK) */}
          {(selectedCategory === "Todas" || MAIN_NEWS.category === selectedCategory) &&
            (!searchTerm || MAIN_NEWS.title.toLowerCase().includes(searchTerm.toLowerCase())) && (
              <Link to={`/noticias/${MAIN_NEWS.id}`} className="featured-news-card">
                <div className="featured-img-wrapper">
                  <img src={MAIN_NEWS.image} alt={MAIN_NEWS.title} className="featured-img" />
                  <span className="news-badge">{MAIN_NEWS.category}</span>
                </div>
                <div className="featured-content">
                  <span className="news-date">{MAIN_NEWS.date}</span>
                  <h2 className="featured-title">{MAIN_NEWS.title}</h2>
                  <p className="featured-summary">{MAIN_NEWS.summary}</p>
                </div>
              </Link>
            )}

          {/* NOTICIAS SECUNDARIAS (LINKS) */}
          {filteredNews.length > 0 ? (
            <div className="secondary-news-grid">
              {filteredNews.map((item) => (
                <Link to={`/noticias/${item.id}`} key={item.id} className="secondary-news-card">
                  <div className="secondary-img-wrapper">
                    <img src={item.image} alt={item.title} className="secondary-img" />
                    <span className="news-badge-sm">{item.category}</span>
                  </div>
                  <div className="secondary-content">
                    <span className="news-date">{item.date}</span>
                    <h3 className="secondary-title">{item.title}</h3>
                    <p className="secondary-summary">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-news-found">
              <p>No se encontraron noticias con los filtros seleccionados.</p>
            </div>
          )}
        </section>

        {/* SIDEBAR */}
        <aside className="news-sidebar">
          
          <div className="sidebar-widget">
            <WeatherWidget />
          </div>

          {/* LO MÁS LEÍDO (LINKS) */}
          <div className="sidebar-widget popular-widget">
            <h3 className="widget-title">Lo más leído</h3>
            <ul className="popular-list">
              {POPULAR_NEWS.map((news, index) => (
                <li key={news.id}>
                  <Link to={`/noticias/${news.id}`} className="popular-item">
                    <span className="popular-number">0{index + 1}</span>
                    <p className="popular-text">{news.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </aside>

      </div>
    </div>
  );
}