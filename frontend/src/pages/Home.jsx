import React, { useState, useEffect } from 'react'
import PropertyFilters from '../components/PropertyFilters'
import PropertyCard from '../components/PropertyCard'
import './Home.css'

const Home = () => {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      // Conectar con la API del backend
      const response = await fetch('/api/inmuebles')
      
      if (!response.ok) {
        throw new Error('Error al cargar las propiedades')
      }
      
      const data = await response.json()
      
      // Transformar datos del backend al formato del frontend
      const transformedData = data.inmuebles?.map(inmueble => ({
        id: inmueble.id_inmueble,
        titulo: inmueble.descripcion?.substring(0, 50) || 'Propiedad sin título',
        ubicacion: inmueble.ubicaciones?.municipio || inmueble.zona || 'Ubicación no especificada',
        precio: inmueble.valor,
        habitaciones: 0, // Se obtendrá de las tablas hijas
        banos: 0, // Se obtendrá de las tablas hijas
        area: 0, // Se obtendrá de las tablas hijas
        tipo: inmueble.tipo_inmueble,
        estado: inmueble.tipo_operacion,
        descripcion: inmueble.descripcion,
        imagen: inmueble.fotografias?.[0]?.url_foto || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
        estrato: inmueble.estrato,
        estado_inmueble: inmueble.estado_inmueble
      })) || []
      
      setProperties(transformedData)
      setFilteredProperties(transformedData)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
      // Datos de ejemplo para desarrollo
      const mockData = [
        {
          id: 1,
          titulo: 'Casa Moderna en el Centro',
          ubicacion: 'Centro, Ciudad',
          precio: 250000,
          habitaciones: 3,
          banos: 2,
          area: 150,
          tipo: 'casa',
          estado: 'venta',
          descripcion: 'Hermosa casa moderna con acabados de lujo, ubicada en zona céntrica con fácil acceso a servicios.',
          imagen: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'
        },
        {
          id: 2,
          titulo: 'Apartamento con Vista al Mar',
          ubicacion: 'Playa Norte',
          precio: 180000,
          habitaciones: 2,
          banos: 2,
          area: 95,
          tipo: 'apartamento',
          estado: 'venta',
          descripcion: 'Apartamento con increíble vista al mar, balcón amplio y amenidades de primera clase.',
          imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
        },
        {
          id: 3,
          titulo: 'Local Comercial Estratégico',
          ubicacion: 'Zona Comercial',
          precio: 1500,
          habitaciones: 0,
          banos: 1,
          area: 80,
          tipo: 'local',
          estado: 'alquiler',
          descripcion: 'Local comercial en zona de alto tráfico, ideal para cualquier tipo de negocio.',
          imagen: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
        }
      ]
      setProperties(mockData)
      setFilteredProperties(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = async (filters) => {
    try {
      setLoading(true)
      
      // Construir query params para el backend
      const params = new URLSearchParams()
      
      if (filters.tipo) params.append('tipo_inmueble', filters.tipo)
      if (filters.estado) params.append('tipo_operacion', filters.estado)
      if (filters.ubicacion) params.append('municipio', filters.ubicacion)
      if (filters.precioMin) params.append('precio_min', filters.precioMin)
      if (filters.precioMax) params.append('precio_max', filters.precioMax)
      
      const queryString = params.toString()
      const url = queryString ? `/api/inmuebles?${queryString}` : '/api/inmuebles'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Error al filtrar propiedades')
      }
      
      const data = await response.json()
      
      // Transformar datos
      let transformedData = data.inmuebles?.map(inmueble => ({
        id: inmueble.id_inmueble,
        titulo: inmueble.descripcion?.substring(0, 50) || 'Propiedad sin título',
        ubicacion: inmueble.ubicaciones?.municipio || inmueble.zona || 'Ubicación no especificada',
        precio: inmueble.valor,
        habitaciones: inmueble.caracteristicas?.habitaciones || 0,
        banos: inmueble.caracteristicas?.banos || 0,
        area: inmueble.caracteristicas?.metros_cuadrados || inmueble.caracteristicas?.area_total || inmueble.caracteristicas?.area_construida || 0,
        tipo: inmueble.tipo_inmueble,
        estado: inmueble.tipo_operacion,
        descripcion: inmueble.descripcion,
        imagen: inmueble.fotografias?.[0]?.url_foto || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
        estrato: inmueble.estrato,
        estado_inmueble: inmueble.estado_inmueble
      })) || []
      
      // Filtros adicionales en el frontend (habitaciones y baños)
      if (filters.habitaciones) {
        transformedData = transformedData.filter(p => p.habitaciones >= Number(filters.habitaciones))
      }
      
      if (filters.banos) {
        transformedData = transformedData.filter(p => p.banos >= Number(filters.banos))
      }
      
      setFilteredProperties(transformedData)
    } catch (error) {
      console.error('Error al filtrar:', error)
      // Si falla, filtrar localmente
      let filtered = [...properties]

      if (filters.tipo) {
        filtered = filtered.filter(p => p.tipo === filters.tipo)
      }

      if (filters.estado) {
        filtered = filtered.filter(p => p.estado === filters.estado)
      }

      if (filters.ubicacion) {
        filtered = filtered.filter(p => 
          p.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase())
        )
      }

      if (filters.precioMin) {
        filtered = filtered.filter(p => p.precio >= Number(filters.precioMin))
      }

      if (filters.precioMax) {
        filtered = filtered.filter(p => p.precio <= Number(filters.precioMax))
      }

      if (filters.habitaciones) {
        filtered = filtered.filter(p => p.habitaciones >= Number(filters.habitaciones))
      }

      if (filters.banos) {
        filtered = filtered.filter(p => p.banos >= Number(filters.banos))
      }

      setFilteredProperties(filtered)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <section className="hero-section">
        <h1>Encuentra tu Propiedad Ideal</h1>
        <p>Soluciones inmobiliarias de excelencia con SONOGROUP S.A.S</p>
      </section>

      <PropertyFilters onFilterChange={handleFilterChange} />

      <section className="properties-section">
        <div className="properties-header">
          <h2>Propiedades Disponibles</h2>
          <span className="results-count">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Cargando propiedades...</p>
          </div>
        )}

        {error && !loading && properties.length === 0 && (
          <div className="error">
            <p>⚠️ {error}</p>
            <p>Mostrando datos de ejemplo</p>
          </div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <div className="no-results">
            <p>No se encontraron propiedades con los filtros seleccionados</p>
          </div>
        )}

        {!loading && filteredProperties.length > 0 && (
          <div className="properties-grid">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
