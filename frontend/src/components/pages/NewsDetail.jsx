import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Tag, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

// IMPORTACIÓN DINÁMICA DE NOTICIAS
import { getNoticias } from '../../config/getNews';

import '../../styles/NewsDetail.css';

// Función auxiliar para dar formato a la fecha
function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export default function NewsDetail() {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Obtener las noticias del municipio activo de forma dinámica
  const newsSummary = getNoticias();

  // Buscar metadatos de la noticia seleccionada
  const newsItem = newsSummary.find((item) => item.id === id);

  useEffect(() => {
    // Scroll al inicio cuando se carga la página
    window.scrollTo(0, 0);

    if (!id) return;

    // Cargar dinámicamente el archivo Markdown según el ID
    import(`../content/news/${id}.md?raw`)
      .then((res) => {
        setContent(res.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando la noticia:', err);
        setContent('No se pudo cargar el cuerpo de la noticia.');
        setLoading(false);
      });
  }, [id]);

  if (!newsItem) {
    return (
      <div className="news-detail-container not-found">
        <h2>Noticia no encontrada</h2>
        <p>La noticia que estás buscando no existe o fue removida.</p>
        <Link to="/" className="back-btn">
          <ArrowLeft size={18} /> Volver a Noticias
        </Link>
      </div>
    );
  }

  return (
    <article className="news-detail-container">
      {/* BOTÓN VOLVER */}
      <Link to="/" className="back-btn">
        <ArrowLeft size={18} /> Volver a Noticias
      </Link>

      {/* ENCABEZADO DE LA NOTICIA */}
      <header className="detail-header">
        <div className="detail-meta">
          <span className="detail-badge">
            <Tag size={13} /> {newsItem.category}
          </span>
          <span className="detail-date">
            <Calendar size={13} /> {formatDate(newsItem.date)}
          </span>
        </div>
        <h1 className="detail-title">{newsItem.title}</h1>
        <p className="detail-summary">{newsItem.summary}</p>
      </header>

      {/* IMAGEN PRINCIPAL */}
      {newsItem.image && (
        <div className="detail-main-img-wrapper">
          <img src={newsItem.image} alt={newsItem.title} className="detail-main-img" />
        </div>
      )}

      {/* CUERPO DEL TEXTO EN MARKDOWN */}
      <div className="detail-content">
        {loading ? (
          <div className="loading-spinner">Cargando contenido...</div>
        ) : (
          <ReactMarkdown
            components={{
              // Estilizado automático para imágenes dentro del Markdown
              img: ({ node, ...props }) => (
                <span className="markdown-img-wrapper">
                  <img {...props} className="markdown-img" alt={props.alt || 'Imagen de la noticia'} />
                  {props.alt && <span className="markdown-img-caption">{props.alt}</span>}
                </span>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      {/* GALERÍA SECUNDARIA / FOTOS ADICIONALES */}
      {newsItem.gallery && newsItem.gallery.length > 0 && (
        <section className="news-gallery-section">
          <h3 className="gallery-title">
            <ImageIcon size={20} /> Galería de imágenes
          </h3>
          <div className="news-gallery-grid">
            {newsItem.gallery.map((imgUrl, index) => (
              <a 
                key={index} 
                href={imgUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="gallery-item"
              >
                <img 
                  src={imgUrl} 
                  alt={`Imagen ${index + 1} de ${newsItem.title}`} 
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN DE VIDEOS */}
      {newsItem.videos && newsItem.videos.length > 0 && (
        <section className="news-videos-section">
          <h3 className="videos-title">
            <VideoIcon size={20} /> Material audiovisual
          </h3>
          <div className="news-videos-grid">
            {newsItem.videos.map((video, index) => (
              <div key={index} className="video-card">
                <div className="video-wrapper">
                  {video.url.includes('youtube') || video.url.includes('embed') ? (
                    <iframe
                      src={video.url}
                      title={video.title || `Video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video controls>
                      <source src={video.url} type="video/mp4" />
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  )}
                </div>
                {video.title && <p className="video-caption">{video.title}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}