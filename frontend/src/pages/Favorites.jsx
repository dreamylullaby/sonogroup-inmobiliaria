import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PropertyCard from '../components/PropertyCard'
import axios from 'axios'
import './Favorites.css'

const Favorites = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchFavorites()
  }, [user, navigate])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/favoritos')
      setFavorites(response.data.favoritos || [])
    } catch (error) {
      console.error('Error al cargar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (id) => {
    try {
      await axios.delete(`/api/favoritos/${id}`)
      setFavorites(favorites.filter(f => f.id_inmueble !== id))
    } catch (error) {
      alert('Error al eliminar favorito')
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando favoritos...</p>
      </div>
    )
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Mis Favoritos
        </h1>
        <p>Propiedades que has guardado</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h2>No tienes favoritos aún</h2>
          <p>Explora propiedades y guarda las que te gusten</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Ver Propiedades
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(property => (
            <PropertyCard 
              key={property.id_inmueble} 
              property={property}
              onRemoveFavorite={handleRemoveFavorite}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
