import React, { useState } from 'react'
import './PropertyFilters.css'

const PropertyFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    tipo: '',
    precioMin: '',
    precioMax: '',
    habitaciones: '',
    banos: '',
    ubicacion: '',
    estado: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      tipo: '',
      precioMin: '',
      precioMax: '',
      habitaciones: '',
      banos: '',
      ubicacion: '',
      estado: ''
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="property-filters">
      <div className="filters-header">
        <h2>Filtrar Propiedades</h2>
        <button onClick={handleReset} className="btn-reset">
          Limpiar Filtros
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="tipo">Tipo de Propiedad</label>
          <select
            id="tipo"
            name="tipo"
            value={filters.tipo}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="apartaestudio">Apartaestudio</option>
            <option value="local">Local</option>
            <option value="bodega">Bodega</option>
            <option value="finca">Finca</option>
            <option value="lote">Lote</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="estado">Tipo de Operación</label>
          <select
            id="estado"
            name="estado"
            value={filters.estado}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="venta">Venta</option>
            <option value="arriendo">Arriendo</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="ubicacion">Ubicación</label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            placeholder="Ciudad, barrio..."
            value={filters.ubicacion}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="precioMin">Precio Mínimo</label>
          <input
            type="number"
            id="precioMin"
            name="precioMin"
            placeholder="$0"
            value={filters.precioMin}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="precioMax">Precio Máximo</label>
          <input
            type="number"
            id="precioMax"
            name="precioMax"
            placeholder="$1,000,000"
            value={filters.precioMax}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="habitaciones">Habitaciones</label>
          <select
            id="habitaciones"
            name="habitaciones"
            value={filters.habitaciones}
            onChange={handleChange}
          >
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="banos">Baños</label>
          <select
            id="banos"
            name="banos"
            value={filters.banos}
            onChange={handleChange}
          >
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default PropertyFilters
