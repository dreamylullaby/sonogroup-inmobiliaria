import { useState, useEffect } from 'react'
import axios from 'axios'
import PropertyFilters from '../components/PropertyFilters'
import PropertyCard from '../components/PropertyCard'
import './Properties.css'

const Properties = () => {
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
      const response = await axios.get('/api/inmuebles')
      const data = response.data
      
      const transformedData = data.inmuebles?.map(inmueble => ({
        id: inmueble.id_inmueble,
        id_inmueble: inmueble.id_inmueble,
        titulo: inmueble.descripcion?.substring(0, 50) || 'Propiedad sin título',
        ubicacion: inmueble.ubicaciones?.municipio || inmueble.zona || 'Ubicación no especificada',
        precio: inmueble.valor,
        habitaciones: 0,
        banos: 0,
        area: 0,
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
      setProperties([])
      setFilteredProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = async (filters) => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      
      if (filters.tipo) params.append('tipo_inmueble', filters.tipo)
      if (filters.estado) params.append('tipo_operacion', filters.estado)
      if (filters.ubicacion) params.append('municipio', filters.ubicacion)
      if (filters.precioMin) params.append('precio_min', filters.precioMin)
      if (filters.precioMax) params.append('precio_max', filters.precioMax)
      
      const queryString = params.toString()
      const url = queryString ? `/api/inmuebles?${queryString}` : '/api/inmuebles'
      
      const response = await axios.get(url)
      const data = response.data
      
      let transformedData = data.inmuebles?.map(inmueble => ({
        id: inmueble.id_inmueble,
        id_inmueble: inmueble.id_inmueble,
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
      
      if (filters.habitaciones) {
        transformedData = transformedData.filter(p => p.habitaciones >= Number(filters.habitaciones))
      }
      
      if (filters.banos) {
        transformedData = transformedData.filter(p => p.banos >= Number(filters.banos))
      }
      
      setFilteredProperties(transformedData)
    } catch (error) {
      console.error('Error al filtrar:', error)
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
    <div className="properties-page">
      <section className="page-header">
        <h1>Nuestras Propiedades</h1>
        <p>Explora nuestro portafolio de inmuebles disponibles</p>
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

export default Properties
