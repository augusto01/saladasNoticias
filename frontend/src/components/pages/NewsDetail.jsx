import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkFrontmatter from 'remark-frontmatter';
import { ArrowLeft, Calendar, Tag, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

import { getNoticias } from '../../config/getNews';
import { configActual } from '../../config/municipios';

import '../../styles/NewsDetail.css';

// Glob para importar todos los .md recursivamente
const markdownFiles = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default' });

// Función para limpiar manualmente el frontmatter (--- YAML ---) del texto raw si remark no lo remueve
function stripFrontmatter(text) {
  if (!text) return '';
  return text.replace(/^---[\s\S]*?---\s*/, '');
}

function formatDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

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

  const newsSummary = getNoticias() || [];
  const newsItem = newsSummary.find((item) => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!id) {
      setLoading(false);
      return;
    }

    const folderName = `news_${configActual.id}`;
    const path = `../content/${folderName}/${id}.md`;

    if (markdownFiles[path]) {
      setLoading(true);
      markdownFiles[path]()
        .then((mdContent) => {
          // Limpia la cabecera YAML antes de pasarlo al parser
          setContent(stripFrontmatter(mdContent));
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error cargando el archivo Markdown:', err);
          setContent('Error al procesar el cuerpo de la noticia.');
          setLoading(false);
        });
    } else {
      console.warn(`No se encontró el archivo markdown en la ruta: ${path}`);
      setContent('No se encontró el archivo de texto para esta noticia.');
      setLoading(false);
    }
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

  // Determina la imagen dinámica correctamente
  const mainImgSrc = newsItem.image || newsItem.imagen || `/news_${configActual.id}/${newsItem.id}/portada.jpg.webp`;

  return (
    <article className="news-detail-container">
      <Link to="/" className="back-btn">
        <ArrowLeft size={18} /> Volver a Noticias
      </Link>

      <header className="detail-header">
        <div className="detail-meta">
          <span className="detail-badge">
            <Tag size={13} /> {newsItem.category || newsItem.categoria}
          </span>
          <span className="detail-date">
            <Calendar size={13} /> {formatDate(newsItem.date || newsItem.fecha)}
          </span>
        </div>
        <h1 className="detail-title">{newsItem.title || newsItem.titulo}</h1>
        <p className="detail-summary">{newsItem.summary || newsItem.subtitulo || newsItem.resumen}</p>
      </header>

      {mainImgSrc && (
        <div className="detail-main-img-wrapper">
          <img 
            src={mainImgSrc} 
            alt={newsItem.title || newsItem.titulo} 
            className="detail-main-img" 
          />
        </div>
      )}

      <div className="detail-content">
        {loading ? (
          <div className="loading-spinner">Cargando contenido...</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkFrontmatter]}
            components={{
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
                  alt={`Imagen ${index + 1} de ${newsItem.title || newsItem.titulo}`} 
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </section>
      )}

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