import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkFrontmatter from 'remark-frontmatter';
import { ArrowLeft, Calendar, Tag, Image as ImageIcon, Video as VideoIcon, Newspaper } from 'lucide-react';
import axios from 'axios';

import { configActual } from '../../config/municipios';
import '../../styles/NewsDetail.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MUNICIPIO_ID = import.meta.env.VITE_MUNICIPIO_ID || import.meta.env.VITE_MUNICIPIO;

const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%23f1f5f9'><rect width='100%' height='100%' fill='%23f1f5f9'/><path d='M360 210 L440 210 L440 290 L360 290 Z' fill='none' stroke='%2394a3b8' stroke-width='4'/><circle cx='385' cy='235' r='10' fill='%2394a3b8'/><path d='M365 280 L395 245 L415 265 L425 255 L435 280 Z' fill='%2394a3b8'/><text x='50%' y='340' font-family='sans-serif' font-size='20' font-weight='600' fill='%2364748b' text-anchor='middle'>Imagen no disponible</text></svg>";

function parseSafeDate(dateString) {
  if (!dateString) return new Date(0);
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date(0) : date;
}

function formatDate(dateString) {
  const date = parseSafeDate(dateString);
  if (date.getTime() === 0) return dateString || '';

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export default function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id || id === 'undefined') {
      setLoading(false);
      setError('ID de noticia no válido');
      return;
    }

    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Obtener la noticia principal por ID desde MongoDB/Render
        const resDetail = await axios.get(`${BACKEND_URL}/noticias/${id}`);
        const dataDetail = resDetail.data?.data || resDetail.data;
        setNewsItem(dataDetail);

        // 2. Obtener otras noticias relacionadas del mismo municipio
        const resOthers = await axios.get(`${BACKEND_URL}/noticias`, {
          params: { municipio: MUNICIPIO_ID }
        });
        const allNews = resOthers.data?.data || (Array.isArray(resOthers.data) ? resOthers.data : []);
        
        // Excluir la noticia actual y tomar las primeras 3
        const filtered = allNews
          .filter((item) => (item._id || item.id) !== id)
          .slice(0, 3);
          
        setOtherNews(filtered);
      } catch (err) {
        console.error('Error al cargar la noticia desde la API:', err);
        setError('La noticia que buscas no existe o fue removida.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="news-detail-container text-center py-5">
        <div className="spinner-border text-primary my-4" role="status">
          <span className="visually-hidden">Cargando noticia...</span>
        </div>
        <p className="text-muted">Cargando contenido de la noticia...</p>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="news-detail-container not-found">
        <h2>Noticia no encontrada</h2>
        <p>{error || 'La noticia que estás buscando no existe o fue removida.'}</p>
        <Link to="/" className="back-btn">
          <ArrowLeft size={18} /> Volver a Noticias
        </Link>
      </div>
    );
  }

  const mainImgSrc = newsItem.imagenPrincipal || newsItem.image || newsItem.imagen;
  const rawMarkdown = newsItem.contenidoMarkdown || newsItem.contenido || '';

  return (
    <article className="news-detail-container">
      <Link to="/" className="back-btn">
        <ArrowLeft size={18} /> Volver a Noticias
      </Link>

      <header className="detail-header">
        <div className="detail-meta">
          <span className="detail-badge">
            <Tag size={13} /> {newsItem.categoria || newsItem.category}
          </span>
          <span className="detail-date">
            <Calendar size={13} /> {formatDate(newsItem.fechaPublicacion || newsItem.createdAt || newsItem.date)}
          </span>
        </div>
        <h1 className="detail-title">{newsItem.titulo || newsItem.title}</h1>
        <p className="detail-summary">{newsItem.subtitulo || newsItem.summary || newsItem.resumen}</p>
      </header>

      {/* BANNER INSTITUCIONAL HORIZONTAL (INICIO) */}
      <div className="detail-ad-banner-container">
        <div className="detail-ad-box">
          <img 
            src="/728x90publi_banner web.gif" 
            alt="Publicidad Institucional" 
            className="detail-ad-crisp-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      <div className="detail-main-img-wrapper">
        <img 
          src={mainImgSrc} 
          alt={newsItem.titulo || newsItem.title} 
          className="detail-main-img" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_PLACEHOLDER;
          }}
        />
      </div>

      {/* CUERPO DE LA NOTICIA DESDE MONGODB */}
      <div className="detail-content">
        {rawMarkdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkFrontmatter]}
            components={{
              img: ({ node, ...props }) => (
                <span className="markdown-img-wrapper">
                  <img 
                    {...props} 
                    className="markdown-img" 
                    alt={props.alt || 'Imagen de la noticia'} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PLACEHOLDER;
                    }}
                  />
                  {props.alt && <span className="markdown-img-caption">{props.alt}</span>}
                </span>
              )
            }}
          >
            {rawMarkdown}
          </ReactMarkdown>
        ) : (
          <p className="text-muted">No hay texto adicional para esta publicación.</p>
        )}
      </div>

      {/* GALERÍA DE IMÁGENES */}
      {newsItem.galeria && newsItem.galeria.length > 0 && (
        <section className="news-gallery-section">
          <h3 className="gallery-title">
            <ImageIcon size={20} /> Galería de imágenes
          </h3>
          <div className="news-gallery-grid">
            {newsItem.galeria.map((imgUrl, index) => (
              <a 
                key={index} 
                href={imgUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="gallery-item"
              >
                <img 
                  src={imgUrl} 
                  alt={`Imagen ${index + 1} de ${newsItem.titulo || newsItem.title}`} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_PLACEHOLDER;
                  }}
                />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* MATERIAL AUDIOVISUAL */}
      {newsItem.videos && newsItem.videos.length > 0 && (
        <section className="news-videos-section">
          <h3 className="videos-title">
            <VideoIcon size={20} /> Material audiovisual
          </h3>
          <div className="news-videos-grid">
            {newsItem.videos.map((video, index) => (
              <div key={index} className="video-card">
                <div className="video-wrapper">
                  {video.url?.includes('youtube') || video.url?.includes('embed') ? (
                    <iframe
                      src={video.url}
                      title={video.titulo || video.title || `Video ${index + 1}`}
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
                {(video.titulo || video.title) && (
                  <p className="video-caption">{video.titulo || video.title}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BANNER INSTITUCIONAL HORIZONTAL (FINAL) */}
      <div className="detail-ad-banner-container">
        <div className="detail-ad-box">
          <img 
            src="/728x90publi_banner web.gif" 
            alt="Publicidad Institucional" 
            className="detail-ad-crisp-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* SECCIÓN MÁS NOTICIAS */}
      {otherNews.length > 0 && (
        <section className="more-news-section">
          <h3 className="more-news-title">
            <Newspaper size={22} /> Más noticias de {configActual?.nombre || 'la localidad'}
          </h3>
          <div className="more-news-grid">
            {otherNews.map((item, index) => {
              const otherId = item._id || item.id || index;
              return (
                <Link 
                  to={`/noticias/${otherId}`} 
                  key={otherId} 
                  className="more-news-card"
                >
                  <div className="more-news-img-wrapper">
                    <img 
                      src={item.imagenPrincipal || item.image || item.imagen} 
                      alt={item.titulo || item.title} 
                      className="more-news-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_PLACEHOLDER;
                      }}
                    />
                    <span className="news-badge-sm">{item.categoria || item.category}</span>
                  </div>
                  <div className="more-news-content">
                    <span className="news-date">{formatDate(item.fechaPublicacion || item.createdAt || item.date)}</span>
                    <h4 className="more-news-card-title">{item.titulo || item.title}</h4>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

    </article>
  );
}