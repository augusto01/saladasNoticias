import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkFrontmatter from 'remark-frontmatter';
import { ArrowLeft, Calendar, Tag, Image as ImageIcon, Video as VideoIcon, Newspaper } from 'lucide-react';

import { configActual } from '../../config/municipios';
import API from '../../../services/api';

import '../../styles/NewsDetail.css';

const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='%23f1f5f9'><rect width='100%' height='100%' fill='%23f1f5f9'/><path d='M360 210 L440 210 L440 290 L360 290 Z' fill='none' stroke='%2394a3b8' stroke-width='4'/><circle cx='385' cy='235' r='10' fill='%2394a3b8'/><path d='M365 280 L395 245 L415 265 L425 255 L435 280 Z' fill='%2394a3b8'/><text x='50%' y='340' font-family='sans-serif' font-size='20' font-weight='600' fill='%2364748b' text-anchor='middle'>Imagen no disponible</text></svg>";

function parseSafeDate(dateString) {
  if (!dateString) return new Date(0);

  const parsed = new Date(dateString);
  if (!isNaN(parsed.getTime())) return parsed;

  if (typeof dateString === 'string') {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 2 && parts[2].length === 4) {
        const [day, month, year] = parts;
        return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
      }
      if (parts[0].length === 4) {
        const [year, month, day] = parts;
        return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
      }
    }
  }

  return new Date(0);
}

function formatDate(dateString) {
  const date = parseSafeDate(dateString);
  if (date.getTime() === 0) return dateString;

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

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id || id === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const municipioSlug = configActual.id || configActual.slug || 'saladas';

        // 1. Obtener la noticia activa por su ID
        const resDetail = await API.get(`/noticias/${id}`);
        setNewsItem(resDetail.data);

        // 2. Obtener otras noticias relacionadas del mismo municipio
        const resAll = await API.get(`/noticias?municipio=${municipioSlug}`);
        const allData = Array.isArray(resAll.data) ? resAll.data : (resAll.data.data || []);
        
        // Filtramos para excluir la noticia actual
        const filtered = allData.filter((item) => (item._id || item.id) !== id).slice(0, 3);
        setOtherNews(filtered);
      } catch (err) {
        console.error('Error al cargar la noticia desde la API:', err);
        setNewsItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="news-detail-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando noticia...</span>
        </div>
        <p style={{ marginTop: '15px', color: '#64748b' }}>Cargando información oficial...</p>
      </div>
    );
  }

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

  const mainImgSrc = newsItem.imagenPrincipal || newsItem.image || newsItem.imagen || DEFAULT_PLACEHOLDER;
  const content = newsItem.contenidoMarkdown || newsItem.contenido || '';
  const gallery = newsItem.galeria || newsItem.gallery || [];
  const videos = newsItem.videos || [];

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
            <Calendar size={13} /> {formatDate(newsItem.fechaPublicacion || newsItem.createdAt || newsItem.date || newsItem.fecha)}
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

      {/* CUERPO DE LA NOTICIA EN MARKDOWN */}
      <div className="detail-content">
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
          {content}
        </ReactMarkdown>
      </div>

      {/* GALERÍA DE IMÁGENES */}
      {gallery && gallery.length > 0 && (
        <section className="news-gallery-section">
          <h3 className="gallery-title">
            <ImageIcon size={20} /> Galería de imágenes
          </h3>
          <div className="news-gallery-grid">
            {gallery.map((imgUrl, index) => (
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
      {videos && videos.length > 0 && (
        <section className="news-videos-section">
          <h3 className="videos-title">
            <VideoIcon size={20} /> Material audiovisual
          </h3>
          <div className="news-videos-grid">
            {videos.map((video, index) => (
              <div key={index} className="video-card">
                <div className="video-wrapper">
                  {video.url && (video.url.includes('youtube') || video.url.includes('embed')) ? (
                    <iframe
                      src={video.url}
                      title={video.title || `Video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video controls>
                      <source src={video.url || video} type="video/mp4" />
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
            <Newspaper size={22} /> Más noticias de {configActual.nombre}
          </h3>
          <div className="more-news-grid">
            {otherNews.map((item, index) => {
              const otherId = item._id || item.id;
              return (
                <Link 
                  to={`/noticias/${otherId}`} 
                  key={otherId ? `more-${otherId}` : `more-${index}`} 
                  className="more-news-card"
                >
                  <div className="more-news-img-wrapper">
                    <img 
                      src={item.imagenPrincipal || item.image || item.imagen || DEFAULT_PLACEHOLDER} 
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
                    <span className="news-date">
                      {formatDate(item.fechaPublicacion || item.createdAt || item.date || item.fecha)}
                    </span>
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