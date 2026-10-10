import React, { useState, useEffect } from 'react';
import API from '../../../services/api';
import { useAuth } from '../../context/AuthContext';
import { configActual } from '../../config/municipios';
import { logout } from '../../routes';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  LogOut,
  RefreshCw,
  Search,
  Calendar
} from 'lucide-react';

export default function NewsAdmin() {
  const { user, logout } = useAuth();

  // Estado para la lista de noticias y carga
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para el Modal (Crear / Editar)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Campos del formulario
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [categoria, setCategoria] = useState('GESTIÓN');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [contenidoMarkdown, setContenidoMarkdown] = useState('');
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [galeria, setGaleria] = useState([]);
  const [destacada, setDestacada] = useState(false);
  const [publicado, setPublicado] = useState(true);

  // Estados de subida de archivos y envío
  const [uploadingMainImg, setUploadingMainImg] = useState(false);
  const [uploadingGaleria, setUploadingGaleria] = useState(false);
  const [saving, setSaving] = useState(false);

  // Municipio activo
  const municipioSlug = configActual.id || configActual.slug || 'santarosa';

  // Función auxiliar para obtener la fecha y hora actual formateada para input datetime-local (YYYY-MM-DDTHH:mm)
  const getFechaActualFormatted = (dateObj = new Date()) => {
    const date = new Date(dateObj);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  // Cargar noticias desde la API
  const fetchNoticias = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/noticias?municipio=${municipioSlug}`);
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setNoticias(data);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
      alert('Error al cargar la lista de noticias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, [municipioSlug]);

  // Abrir Modal para Crear
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setTitulo('');
    setSubtitulo('');
    setCategoria('GESTIÓN');
    setFechaPublicacion(getFechaActualFormatted()); // Carga por defecto la fecha y hora actual
    setContenidoMarkdown('');
    setImagenPrincipal('');
    setGaleria([]);
    setDestacada(false);
    setPublicado(true);
    setShowModal(true);
  };

  // Abrir Modal para Editar
  const handleOpenEditModal = (noticia) => {
    setEditingId(noticia._id);
    setTitulo(noticia.titulo || '');
    setSubtitulo(noticia.subtitulo || '');
    setCategoria(noticia.categoria || 'GESTIÓN');
    
    // Carga la fecha original de la noticia o la actual si no existiera
    const fechaOrigen = noticia.fechaPublicacion || noticia.createdAt;
    setFechaPublicacion(fechaOrigen ? getFechaActualFormatted(fechaOrigen) : getFechaActualFormatted());

    setContenidoMarkdown(noticia.contenidoMarkdown || noticia.contenido || '');
    setImagenPrincipal(noticia.imagenPrincipal || '');
    setGaleria(noticia.galeria || noticia.gallery || []);
    setDestacada(noticia.destacada || false);
    setPublicado(noticia.publicado !== undefined ? noticia.publicado : true);
    setShowModal(true);
  };

  // Subir Imagen Principal a Supabase
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingMainImg(true);
    const formData = new FormData();
    formData.append('imagen', file);

    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setImagenPrincipal(res.data.url);
      }
    } catch (error) {
      console.error('Error al subir la imagen principal:', error);
      alert('No se pudo subir la imagen principal.');
    } finally {
      setUploadingMainImg(false);
    }
  };

  // Subir Galería (Hasta 3 imágenes)
  const handleGaleriaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (galeria.length + files.length > 3) {
      alert(`Solo podés cargar un máximo de 3 imágenes en la galería. Actualmente tenés ${galeria.length}.`);
      return;
    }

    setUploadingGaleria(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('imagen', file);

        const res = await API.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data && res.data.url) {
          uploadedUrls.push(res.data.url);
        }
      }
      setGaleria((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error al subir imágenes a la galería:', error);
      alert('Error al subir las imágenes de la galería.');
    } finally {
      setUploadingGaleria(false);
    }
  };

  const handleRemoveGaleriaImg = (indexToRemove) => {
    setGaleria((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Guardar Noticia (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !contenidoMarkdown.trim()) {
      alert('El título y el contenido Markdown son obligatorios.');
      return;
    }

    if (!imagenPrincipal || !imagenPrincipal.trim()) {
      alert('La imagen de portada es obligatoria para publicar una noticia.');
      return;
    }

    setSaving(true);
    const payload = {
      municipio: municipioSlug,
      municipioId: municipioSlug,
      titulo: titulo.trim(),
      subtitulo: subtitulo.trim(),
      categoria: categoria.toUpperCase().trim(),
      fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion).toISOString() : new Date().toISOString(),
      contenidoMarkdown: contenidoMarkdown.trim(),
      imagenPrincipal: imagenPrincipal.trim(),
      galeria,
      destacada,
      publicado
    };

    try {
      if (editingId) {
        await API.put(`/noticias/${editingId}`, payload);
      } else {
        await API.post('/noticias', payload);
      }

      setShowModal(false);
      fetchNoticias();
    } catch (error) {
      console.error('Error al guardar noticia:', error);
      alert(error.response?.data?.error || 'Ocurrió un error al guardar la noticia.');
    } finally {
      setSaving(false);
    }
  };

  // Baja Lógica de la Noticia (Despublicar)
  const handleDelete = async (id, tituloNoticia) => {
    if (window.confirm(`¿Estás seguro de que deseas dar de baja la noticia "${tituloNoticia}"?`)) {
      try {
        await API.delete(`/noticias/${id}`);
        fetchNoticias();
      } catch (error) {
        console.error('Error al dar de baja la noticia:', error);
        alert('No se pudo dar de baja la noticia.');
      }
    }
  };

  // Filtrado de noticias por búsqueda
  const noticiasFiltradas = noticias.filter((item) =>
    item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    // 1. Ejecutar la función para limpiar el storage
    logout();

    // 2. Redirigir al usuario al Login
    navigate('/login');

    // 3. Opcional: Forzar un refresco si querés asegurar que los estados globales se limpien de cero
    // window.location.href = '/login';
  };

  return (
    <div className="container-fluid py-3 px-2 px-md-4 bg-light min-vh-100">
      
      {/* ESTILOS DE RESPONSIVIDAD PARA EL MODAL */}
      <style>{`
        .custom-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 10px;
        }
        .custom-modal-dialog {
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          background: #fff;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .custom-modal-header {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
        }
        .custom-modal-body {
          padding: 1rem;
          overflow-y: auto;
          flex: 1 1 auto;
        }
        .custom-modal-footer {
          padding: 0.75rem 1rem;
          border-top: 1px solid #dee2e6;
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          background-color: #f8f9fa;
        }
        @media (max-width: 576px) {
          .admin-header-actions {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .admin-header-actions button {
            width: 100%;
            justify-content: center;
          }
          .custom-modal-footer {
            flex-direction: column-reverse;
          }
          .custom-modal-footer button {
            width: 100%;
          }
        }
      `}</style>

      {/* CABECERA PRINCIPAL */}
      <div className="bg-white p-3 p-md-4 rounded shadow-sm mb-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-primary fs-4 fs-md-2">
              Panel de Noticias - {configActual.nombre}
            </h2>
            <p className="text-muted mb-0 small">
              Usuario: <strong>{user?.email || 'Administrador'}</strong> | Rol: <strong>{user?.rol || 'EDITOR'}</strong>
            </p>
          </div>

          <div className="admin-header-actions d-flex align-items-center gap-2">
            <button 
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={fetchNoticias} 
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Actualizar</span>
            </button>
            
            <button 
              className="btn btn-primary btn-sm d-flex align-items-center gap-1 fw-bold"
              onClick={handleOpenCreateModal}
            >
              <Plus size={18} />
              <span>Nueva Noticia</span>
            </button>

            <button 
              onClick={handleLogout} 
              className="btn btn-outline-danger btn-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* FILTRO Y BUSCADOR */}
      <div className="bg-white p-3 rounded shadow-sm mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar por título o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 text-md-end text-muted small">
            Mostrando <strong>{noticiasFiltradas.length}</strong> de <strong>{noticias.length}</strong> noticias
          </div>
        </div>
      </div>

      {/* TABLA DE NOTICIAS */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted mb-0">Cargando noticias...</p>
          </div>
        ) : noticiasFiltradas.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-0 fs-5">No se encontraron noticias registradas.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '70px' }}>Imagen</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th className="d-none d-md-table-cell">Fecha</th>
                  <th className="text-center">Estado</th>
                  <th className="text-end" style={{ minWidth: '100px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {noticiasFiltradas.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.imagenPrincipal ? (
                        <img
                          src={item.imagenPrincipal}
                          alt={item.titulo}
                          className="rounded"
                          style={{ width: '50px', height: '35px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center text-muted" style={{ width: '50px', height: '35px' }}>
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '240px' }}>
                        {item.titulo}
                      </div>
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '240px' }}>
                        {item.subtitulo || 'Sin subtítulo'}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-secondary text-uppercase" style={{ fontSize: '10px' }}>
                        {item.categoria || 'GESTIÓN'}
                      </span>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <small className="text-muted">
                        {new Date(item.fechaPublicacion || item.createdAt).toLocaleDateString()}
                      </small>
                    </td>
                    <td className="text-center">
                      {item.publicado !== false ? (
                        <span className="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                          <CheckCircle size={10} /> Publicado
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger d-inline-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                          <XCircle size={10} /> Borrador
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary p-1"
                          onClick={() => handleOpenEditModal(item)}
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger p-1"
                          onClick={() => handleDelete(item._id, item.titulo)}
                          title="Dar de baja"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR RESPONSIVO */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-dialog">
            
            <div className="custom-modal-header">
              <h5 className="fw-bold mb-0 text-truncate pe-2">
                {editingId ? 'Editar Noticia' : 'Nueva Noticia'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowModal(false)}
                aria-label="Cerrar"
                disabled={saving}
              ></button>
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column overflow-hidden flex-grow-1">
              <div className="custom-modal-body">
                
                {/* Título y Categoría */}
                <div className="row g-2 mb-3">
                  <div className="col-12 col-md-8">
                    <label className="form-label fw-bold small mb-1">Título *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      required
                      placeholder="Ej: Inauguración de obras en el centro"
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold small mb-1">Categoría</label>
                    <select
                      className="form-select form-select-sm"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      <option value="GESTIÓN">GESTIÓN</option>
                      <option value="OBRAS">OBRAS</option>
                      <option value="CULTURA">CULTURA</option>
                      <option value="DEPORTES">DEPORTES</option>
                      <option value="SALUD">SALUD</option>
                      <option value="EDUCACIÓN">EDUCACIÓN</option>
                      <option value="POLICIALES">POLICIALES</option>
                      <option value="LOCALES">LOCALES</option>
                    </select>
                  </div>
                </div>

                {/* Subtítulo y Fecha de Publicación */}
                <div className="row g-2 mb-3">
                  <div className="col-12 col-md-8">
                    <label className="form-label fw-bold small mb-1">Subtítulo / Bajada</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={subtitulo}
                      onChange={(e) => setSubtitulo(e.target.value)}
                      placeholder="Breve resumen de la noticia..."
                    />
                  </div>

                  {/* CAMPO DE FECHA MODIFICABLE */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-bold small mb-1 d-flex align-items-center gap-1">
                      <Calendar size={14} /> Fecha de Publicación
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control form-control-sm"
                      value={fechaPublicacion}
                      onChange={(e) => setFechaPublicacion(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Imagen Principal (REQUERIDA) */}
                <div className="mb-3">
                  <label className="form-label fw-bold small mb-1">Imagen de Portada (Obligatoria) *</label>
                  
                  <div className="input-group input-group-sm mb-2">
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://... URL de la portada"
                      value={imagenPrincipal}
                      onChange={(e) => setImagenPrincipal(e.target.value)}
                      required
                    />
                  </div>

                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    disabled={uploadingMainImg}
                  />
                  {uploadingMainImg && (
                    <small className="text-primary mt-1 d-block">Subiendo imagen de portada...</small>
                  )}
                  {imagenPrincipal && (
                    <div className="mt-2 position-relative d-inline-block border rounded p-1">
                      <img
                        src={imagenPrincipal}
                        alt="Vista previa"
                        style={{ height: '80px', objectFit: 'cover' }}
                        className="rounded"
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 rounded-circle"
                        style={{ width: '20px', height: '20px', fontSize: '10px' }}
                        onClick={() => setImagenPrincipal('')}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Galería (Máximo 3) */}
                <div className="mb-3 p-2 bg-light rounded border">
                  <label className="form-label fw-bold small mb-1">
                    Galería de imágenes adicionales (Máximo 3)
                  </label>
                  
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    multiple
                    disabled={galeria.length >= 3 || uploadingGaleria}
                    onChange={handleGaleriaUpload}
                  />

                  <small className="form-text text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                    {galeria.length}/3 imágenes cargadas.
                  </small>

                  {uploadingGaleria && (
                    <div className="d-flex align-items-center gap-2 mt-1 text-primary small">
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      <span>Subiendo imágenes...</span>
                    </div>
                  )}

                  {galeria.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {galeria.map((url, idx) => (
                        <div 
                          key={idx} 
                          className="position-relative border rounded overflow-hidden shadow-sm bg-white" 
                          style={{ width: '70px', height: '70px' }}
                        >
                          <img 
                            src={url} 
                            alt={`Galería ${idx + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '18px', height: '18px', fontSize: '10px' }}
                            onClick={() => handleRemoveGaleriaImg(idx)}
                            title="Eliminar foto"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cuerpo Markdown */}
                <div className="mb-3">
                  <label className="form-label fw-bold small mb-1">Contenido de la Noticia (Markdown) *</label>
                  <textarea
                    className="form-control form-control-sm font-monospace"
                    rows="8"
                    value={contenidoMarkdown}
                    onChange={(e) => setContenidoMarkdown(e.target.value)}
                    required
                    placeholder="Escribí aquí el cuerpo de la noticia..."
                  ></textarea>
                </div>

                {/* Opciones adicionales */}
                <div className="d-flex flex-wrap gap-3 border-top pt-2">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="destacadaSwitch"
                      checked={destacada}
                      onChange={(e) => setDestacada(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold small" htmlFor="destacadaSwitch">
                      Noticia Destacada
                    </label>
                  </div>

                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="publicadoSwitch"
                      checked={publicado}
                      onChange={(e) => setPublicado(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold small" htmlFor="publicadoSwitch">
                      Publicado (Visible)
                    </label>
                  </div>
                </div>

              </div>

              {/* BOTONES CON SPINNER ANTI DOBLE SUBMIT EN EL PIE DEL MODAL */}
              <div className="custom-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm fw-bold d-flex align-items-center justify-content-center gap-2"
                  disabled={saving || uploadingMainImg || uploadingGaleria}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    editingId ? 'Guardar Cambios' : 'Crear Noticia'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}