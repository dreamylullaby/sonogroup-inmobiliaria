import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './PropertyDetail.css'

const PropertyDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  useEffect(() => {
    fetchProperty()
    if (user) {
      checkFavorite()
    }
  }, [id, user])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/inmuebles/${id}`)
      setProperty(response.data.inmueble)
    } catch (error) {
      console.error('Error al cargar propiedad:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    try {
      const response = await axios.get('/api/favoritos')
      const favorites = response.data.favoritos || []
      setIsFavorite(favorites.some(f => f.id_inmueble === parseInt(id)))
    } catch (error) {
      console.error('Error al verificar favoritos:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      if (isFavorite) {
        await axios.delete(`/api/favoritos/${id}`)
        setIsFavorite(false)
      } else {
        await axios.post('/api/favoritos', { id_inmueble: id })
        setIsFavorite(true)
      }
    } catch (error) {
      alert('Error al actualizar favoritos: ' + error.response?.data?.error)
    }
  }

  const handleContact = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowContactForm(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando propiedad...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="error">
        <p>Propiedad no encontrada</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="property-detail">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Volver
      </button>

      <div className="detail-header">
        <div className="detail-title-section">
          <h1>{property.titulo}</h1>
          <p className="detail-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {property.ubicacion}
          </p>
        </div>
        <div className="detail-actions">
          <button 
            onClick={toggleFavorite} 
            className={`btn-favorite ${isFavorite ? 'active' : ''}`}
            title={user ? (isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos') : 'Inicia sesión para guardar'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {isFavorite ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="detail-image-gallery">
        <img 
          src={property.imagen || 'https://via.placeholder.com/800x500?text=Sin+Imagen'} 
          alt={property.titulo}
          className="detail-main-image"
        />
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-price-section">
            <span className={`detail-badge ${property.estado}`}>
              {property.estado === 'venta' ? 'En Venta' : 'En Alquiler'}
            </span>
            <h2 className="detail-price">{formatPrice(property.precio)}</h2>
          </div>

          <div className="detail-features">
            {property.habitaciones && (
              <div className="feature-item">
                <span className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </span>
                <div>
                  <strong>{property.habitaciones}</strong>
                  <p>Habitaciones</p>
                </div>
              </div>
            )}
            {property.banos && (
              <div className="feature-item">
                <span className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l-6 6 6 6"></path>
                    <path d="M20 4v2.5c0 1.5-1 2.5-2.5 2.5H4"></path>
                  </svg>
                </span>
                <div>
                  <strong>{property.banos}</strong>
                  <p>Baños</p>
                </div>
              </div>
            )}
            {property.area && (
              <div className="feature-item">
                <span className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </span>
                <div>
                  <strong>{property.area} m²</strong>
                  <p>Área</p>
                </div>
              </div>
            )}
            {property.tipo && (
              <div className="feature-item">
                <span className="feature-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                </span>
                <div>
                  <strong>{property.tipo}</strong>
                  <p>Tipo</p>
                </div>
              </div>
            )}
          </div>

          <div className="detail-description">
            <h3>Descripción</h3>
            <p>{property.descripcion || 'Sin descripción disponible'}</p>
          </div>

          {property.servicios && (
            <div className="detail-services">
              <h3>Servicios</h3>
              <ul>
                {property.servicios.split(',').map((servicio, index) => (
                  <li key={index}>✓ {servicio.trim()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="contact-card">
            <h3>¿Interesado en esta propiedad?</h3>
            <p>Contáctanos para más información</p>
            <button onClick={handleContact} className="btn-contact">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Contactar
            </button>
            {!user && (
              <p className="login-hint">
                <Link to="/login">Inicia sesión</Link> para contactar
              </p>
            )}
          </div>

          <div className="info-card">
            <h4>Información adicional</h4>
            <div className="info-item">
              <span>ID:</span>
              <strong>{property.id_inmueble}</strong>
            </div>
            <div className="info-item">
              <span>Publicado:</span>
              <strong>{new Date(property.fecha_publicacion).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {showContactForm && (
        <ContactModal 
          property={property}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  )
}

const ContactModal = ({ property, onClose }) => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/contactos', {
        id_inmueble: property.id_inmueble,
        mensaje: message
      })
      alert('Mensaje enviado exitosamente')
      onClose()
    } catch (error) {
      alert('Error al enviar mensaje: ' + error.response?.data?.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contactar sobre: {property.titulo}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Mensaje</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows="5"
              required
              disabled={loading}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyDetail
