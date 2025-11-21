import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UserModal from '../components/UserModal'
import axios from 'axios'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalPropiedades: 0,
    totalUsuarios: 0,
    propiedadesVenta: 0,
    propiedadesAlquiler: 0
  })
  const [usuarios, setUsuarios] = useState([])
  const [propiedadesPendientes, setPropiedadesPendientes] = useState([])
  const [propiedades, setPropiedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeTab, setActiveTab] = useState('usuarios')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Obtener usuarios
      const usuariosRes = await axios.get('/api/usuarios')
      setUsuarios(usuariosRes.data.usuarios || [])

      // Obtener propiedades
      const propiedadesRes = await axios.get('/api/inmuebles')
      const propiedadesData = propiedadesRes.data.inmuebles || []
      setPropiedades(propiedadesData)

      // Obtener propiedades pendientes
      const pendientesRes = await axios.get('/api/propiedades-pendientes')
      setPropiedadesPendientes(pendientesRes.data.propiedades || [])

      setStats({
        totalPropiedades: propiedadesData.length,
        totalUsuarios: usuariosRes.data.usuarios?.length || 0,
        propiedadesVenta: propiedadesData.filter(p => p.tipo_operacion === 'venta').length,
        propiedadesAlquiler: propiedadesData.filter(p => p.tipo_operacion === 'arriendo').length
      })
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddUser = () => {
    setModalMode('add')
    setSelectedUser(null)
    setModalOpen(true)
  }

  const handleEditUser = (usuario) => {
    setModalMode('edit')
    setSelectedUser(usuario)
    setModalOpen(true)
  }

  const handleSaveUser = async (formData) => {
    try {
      if (modalMode === 'add') {
        // Crear nuevo usuario
        const response = await axios.post('/api/auth/registro', formData)
        setUsuarios([...usuarios, response.data.usuario])
        setStats(prev => ({ ...prev, totalUsuarios: prev.totalUsuarios + 1 }))
        return { success: true }
      } else {
        // Actualizar usuario existente
        const response = await axios.put(`/api/usuarios/${selectedUser.id_usuario}`, formData)
        setUsuarios(usuarios.map(u => 
          u.id_usuario === selectedUser.id_usuario ? response.data.usuario : u
        ))
        return { success: true }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al guardar usuario' 
      }
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return
    }

    try {
      await axios.delete(`/api/usuarios/${id}`)
      setUsuarios(usuarios.filter(u => u.id_usuario !== id))
      setStats(prev => ({ ...prev, totalUsuarios: prev.totalUsuarios - 1 }))
      alert('Usuario eliminado exitosamente')
    } catch (error) {
      alert('Error al eliminar usuario: ' + error.response?.data?.error)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando panel de administración...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {user?.nombre}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Cerrar Sesión
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.totalPropiedades}</h3>
            <p>Total Propiedades</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsuarios}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.propiedadesVenta}</h3>
            <p>En Venta</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.propiedadesAlquiler}</h3>
            <p>En Alquiler</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Usuarios
        </button>
        <button 
          className={`tab-button ${activeTab === 'propiedades' ? 'active' : ''}`}
          onClick={() => setActiveTab('propiedades')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          Propiedades Publicadas ({propiedades.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'pendientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('pendientes')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Pendientes ({propiedadesPendientes.filter(p => p.estado_aprobacion === 'pendiente').length})
        </button>
      </div>

      {activeTab === 'usuarios' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Gestión de Usuarios</h2>
            <button className="btn-add" onClick={handleAddUser}>+ Agregar Usuario</button>
          </div>

        {usuarios.length === 0 ? (
          <div className="empty-state">
            <p>No hay usuarios registrados</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefono || 'N/A'}</td>
                    <td>
                      <span className={`badge ${usuario.rol}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td>{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-icon btn-edit" 
                          title="Editar"
                          onClick={() => handleEditUser(usuario)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="btn-icon btn-delete" 
                          title="Eliminar"
                          onClick={() => handleDeleteUser(usuario.id_usuario)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
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
      )}

      {activeTab === 'propiedades' && (
        <PropiedadesPublicadasSection 
          propiedades={propiedades}
          onUpdate={fetchData}
        />
      )}

      {activeTab === 'pendientes' && (
        <PropiedadesPendientesSection 
          propiedades={propiedadesPendientes}
          onUpdate={fetchData}
        />
      )}

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  )
}

const PropiedadesPublicadasSection = ({ propiedades, onUpdate }) => {
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) return

    try {
      await axios.delete(`/api/inmuebles/${id}`)
      alert('Propiedad eliminada exitosamente')
      onUpdate()
    } catch (error) {
      alert('Error: ' + error.response?.data?.error)
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Propiedades Publicadas</h2>
      </div>

      {propiedades.length === 0 ? (
        <div className="empty-state">
          <p>No hay propiedades publicadas</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Operación</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propiedades.map(propiedad => (
                <tr key={propiedad.id_inmueble}>
                  <td>{propiedad.id_inmueble}</td>
                  <td>{propiedad.descripcion?.substring(0, 50)}...</td>
                  <td>
                    <span className="badge">
                      {propiedad.tipo_inmueble}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${propiedad.tipo_operacion}`}>
                      {propiedad.tipo_operacion}
                    </span>
                  </td>
                  <td>${propiedad.valor?.toLocaleString()}</td>
                  <td>
                    <span className="badge">
                      {propiedad.estado_inmueble}
                    </span>
                  </td>
                  <td>{new Date(propiedad.fecha_registro).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn-icon btn-delete" 
                        title="Eliminar"
                        onClick={() => handleEliminar(propiedad.id_inmueble)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
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
  )
}

const PropiedadesPendientesSection = ({ propiedades, onUpdate }) => {
  const handleAprobar = async (id) => {
    if (!window.confirm('¿Aprobar esta propiedad?')) return

    try {
      await axios.put(`/api/propiedades-pendientes/${id}/aprobar`)
      alert('Propiedad aprobada y publicada')
      onUpdate()
    } catch (error) {
      alert('Error: ' + error.response?.data?.error)
    }
  }

  const handleRechazar = async (id) => {
    const motivo = prompt('Motivo del rechazo:')
    if (!motivo) return

    try {
      await axios.put(`/api/propiedades-pendientes/${id}/rechazar`, { motivo })
      alert('Propiedad rechazada')
      onUpdate()
    } catch (error) {
      alert('Error: ' + error.response?.data?.error)
    }
  }

  const pendientes = propiedades.filter(p => p.estado_aprobacion === 'pendiente')

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Propiedades Pendientes de Aprobación</h2>
      </div>

      {pendientes.length === 0 ? (
        <div className="empty-state">
          <p>No hay propiedades pendientes</p>
        </div>
      ) : (
        <div className="properties-pending-grid">
          {pendientes.map(propiedad => (
            <div key={propiedad.id_propiedad_pendiente} className="property-pending-card">
              <img 
                src={propiedad.imagen || 'https://via.placeholder.com/400x300'} 
                alt={propiedad.titulo}
                className="property-pending-image"
              />
              <div className="property-pending-content">
                <h3>{propiedad.titulo}</h3>
                <p className="property-pending-user">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {propiedad.usuarios?.nombre} ({propiedad.usuarios?.email})
                </p>
                <p className="property-pending-price">
                  ${propiedad.precio.toLocaleString()}
                </p>
                <p className="property-pending-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {propiedad.ubicacion}
                </p>
                <p className="property-pending-description">
                  {propiedad.descripcion?.substring(0, 100)}...
                </p>
                <div className="property-pending-features">
                  {propiedad.habitaciones && (
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }}>
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      {propiedad.habitaciones}
                    </span>
                  )}
                  {propiedad.banos && (
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }}>
                        <path d="M9 6l-6 6 6 6"></path>
                        <path d="M20 4v2.5c0 1.5-1 2.5-2.5 2.5H4"></path>
                      </svg>
                      {propiedad.banos}
                    </span>
                  )}
                  {propiedad.area && (
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                      {propiedad.area}m²
                    </span>
                  )}
                </div>
                <div className="property-pending-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleAprobar(propiedad.id_propiedad_pendiente)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Aprobar
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleRechazar(propiedad.id_propiedad_pendiente)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
