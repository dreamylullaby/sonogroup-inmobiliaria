import React, { useState, useEffect } from 'react'
import './UserModal.css'

const UserModal = ({ isOpen, onClose, onSave, user, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'usuario'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        password: '',
        rol: user.rol || 'usuario'
      })
    } else {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        rol: 'usuario'
      })
    }
    setError('')
  }, [user, mode, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (!formData.nombre || !formData.email) {
      setError('Nombre y email son requeridos')
      return
    }

    if (mode === 'add' && !formData.password) {
      setError('La contraseña es requerida para nuevos usuarios')
      return
    }

    if (formData.password && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    const result = await onSave(formData)
    setLoading(false)

    if (result.success) {
      onClose()
    } else {
      setError(result.error || 'Error al guardar usuario')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'add' ? '➕ Agregar Usuario' : '✏️ Editar Usuario'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="modal-error">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              disabled={loading || mode === 'edit'}
              required
            />
            {mode === 'edit' && (
              <small style={{ color: 'var(--text-light)' }}>
                El email no se puede modificar
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="1234567890"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña {mode === 'add' ? '*' : '(dejar vacío para no cambiar)'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              required={mode === 'add'}
            />
            <small style={{ color: 'var(--text-light)' }}>
              Mínimo 6 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="rol">Rol *</label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Guardando...' : mode === 'add' ? 'Crear Usuario' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserModal
