import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './PublishProperty.css'

const PublishProperty = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Datos comunes (tabla inmuebles)
  const [formDataComun, setFormDataComun] = useState({
    valor: '',
    estrato: '3',
    descripcion: '',
    numero_matricula: '',
    tipo_operacion: 'venta',
    tipo_inmueble: 'casa',
    estado_inmueble: 'nuevo',
    zona: 'urbano',
    estado_conservacion: 'nuevo'  // Obligatorio: nuevo, usado, remodelado
  })

  // Datos de ubicación
  const [ubicacion, setUbicacion] = useState({
    direccion: '',
    barrio_vereda: '',
    municipio: '',
    departamento: 'Colombia',
    tipo_via: 'Calle'
  })

  // Datos de servicios públicos
  const [servicios, setServicios] = useState({
    acueducto: true,
    energia: true,
    alcantarillado: true,
    gas: false,
    internet: false
  })

  // Características específicas según tipo
  const [caracteristicasEspecificas, setCaracteristicasEspecificas] = useState({})

  // Campos específicos por tipo de inmueble
  const camposPorTipo = {
    casa: [
      { name: 'area_frente', label: 'Área Frente (m)', type: 'number', step: '0.01' },
      { name: 'area_fondo', label: 'Área Fondo (m)', type: 'number', step: '0.01' },
      { name: 'anos_construccion', label: 'Años de Construcción', type: 'number' },
      { name: 'metros_cuadrados', label: 'Metros Cuadrados', type: 'number', required: true },
      { name: 'pisos', label: 'Número de Pisos', type: 'number' },
      { name: 'habitaciones', label: 'Habitaciones', type: 'number' },
      { name: 'banos', label: 'Baños', type: 'number' },
      { name: 'patio', label: 'Patio', type: 'checkbox' },
      { name: 'jardin', label: 'Jardín', type: 'checkbox' },
      { name: 'balcon', label: 'Balcón', type: 'checkbox' },
      { name: 'terraza', label: 'Terraza', type: 'checkbox' },
      { name: 'descripcion_acabados', label: 'Descripción de Acabados', type: 'textarea' },
      { name: 'sala_comedor', label: 'Sala/Comedor', type: 'select', options: ['sala-comedor', 'separados', 'ninguno'] },
      { name: 'cocina', label: 'Cocina', type: 'select', options: ['integral', 'tradicional', 'americana'] },
      { name: 'zona_lavado', label: 'Zona de Lavado', type: 'select', options: ['interna', 'externa', 'ninguna'] },
      { name: 'parqueadero', label: 'Parqueadero', type: 'select', options: ['cubierto', 'descubierto', 'ninguno'] }
    ],
    apartamento: [
      { name: 'area_total', label: 'Área Total (m²)', type: 'number', step: '0.01', required: true },
      { name: 'pisos_edificio', label: 'Pisos del Edificio', type: 'number' },
      { name: 'torre', label: 'Torre/Bloque', type: 'number' },
      { name: 'habitaciones', label: 'Habitaciones', type: 'number' },
      { name: 'banos', label: 'Baños', type: 'number' },
      { name: 'balcon', label: 'Balcón', type: 'checkbox' },
      { name: 'ascensor', label: 'Ascensor', type: 'checkbox' },
      { name: 'vigilancia', label: 'Vigilancia 24h', type: 'checkbox' },
      { name: 'administracion', label: 'Valor Administración', type: 'number', step: '0.01' },
      { name: 'zona_social', label: 'Zona Social', type: 'text' },
      { name: 'descripcion', label: 'Descripción General', type: 'textarea' },
      { name: 'cocina', label: 'Tipo de Cocina', type: 'select', options: ['integral', 'tradicional', 'americana'] },
      { name: 'parqueadero', label: 'Parqueadero', type: 'select', options: ['cubierto', 'descubierto', 'ninguno'] }
    ],
    apartaestudio: [
      { name: 'area_total', label: 'Área Total (m²)', type: 'number', step: '0.01', required: true },
      { name: 'bano', label: 'Baño', type: 'checkbox' },
      { name: 'parqueadero', label: 'Parqueadero', type: 'checkbox' },
      { name: 'balcon', label: 'Balcón', type: 'checkbox' },
      { name: 'amoblado', label: 'Amoblado', type: 'checkbox' },
      { name: 'cocina', label: 'Tipo de Cocina', type: 'select', options: ['integral', 'tradicional', 'americana'] },
      { name: 'descripcion_acabados', label: 'Descripción de Acabados', type: 'textarea' }
    ],
    local: [
      { name: 'area_total', label: 'Área Total (m²)', type: 'number', step: '0.01', required: true },
      { name: 'frente', label: 'Frente (m)', type: 'number', step: '0.01' },
      { name: 'fondo', label: 'Fondo (m)', type: 'number', step: '0.01' },
      { name: 'altura', label: 'Altura (m)', type: 'number', step: '0.01' },
      { name: 'entrepiso', label: 'Entrepiso', type: 'checkbox' },
      { name: 'tiempo', label: 'Tiempo (Antigüedad establecida)', type: 'checkbox' },
      { name: 'parqueadero', label: 'Parqueadero', type: 'text' },
      { name: 'descripcion_acabados', label: 'Descripción de Acabados', type: 'textarea' },
      { name: 'zona_local', label: 'Zona del Local', type: 'select', options: ['comercial', 'residencial', 'mixta'] }
    ],
    bodega: [
      { name: 'area_construida', label: 'Área Construida (m²)', type: 'number', step: '0.01', required: true },
      { name: 'altura_libre', label: 'Altura Libre (m)', type: 'number', step: '0.01' },
      { name: 'tipo_puerta_carga', label: 'Tipo Puerta de Carga', type: 'select', options: ['rodante', 'batiente', 'ninguna'] },
      { name: 'capacidad_carga', label: 'Capacidad de Carga', type: 'text' },
      { name: 'oficinas', label: 'Oficinas', type: 'checkbox' },
      { name: 'banos', label: 'Baños', type: 'checkbox' },
      { name: 'vestier', label: 'Vestier', type: 'checkbox' },
      { name: 'descripcion_acabados', label: 'Descripción de Acabados', type: 'textarea' }
    ],
    finca: [
      { name: 'area_total', label: 'Área Total', type: 'number', step: '0.01', required: true },
      { name: 'area_cultivable', label: 'Área Cultivable', type: 'number', step: '0.01' },
      { name: 'area_construcciones', label: 'Área de Construcciones (m²)', type: 'number', step: '0.01' },
      { name: 'fuentes_agua', label: 'Fuentes de Agua', type: 'checkbox' },
      { name: 'casa_principal', label: 'Casa Principal', type: 'checkbox' },
      { name: 'otras_construcciones', label: 'Otras Construcciones', type: 'textarea' },
      { name: 'cultivos_actuales', label: 'Cultivos Actuales', type: 'textarea' },
      { name: 'descripcion_acabados', label: 'Descripción de Acabados', type: 'textarea' },
      { name: 'luz', label: 'Servicio de Luz', type: 'checkbox' },
      { name: 'cercas', label: 'Cercas', type: 'checkbox' },
      { name: 'unidad_area', label: 'Unidad de Área', type: 'select', options: ['m2', 'hectareas', 'fanegadas'] },
      { name: 'topografia', label: 'Topografía', type: 'select', options: ['plana', 'ondulada', 'montanosa'] },
      { name: 'vias_acceso', label: 'Vías de Acceso', type: 'select', options: ['pavimentada', 'destapada', 'mixta'] }
    ],
    lote: [
      { name: 'area_total', label: 'Área Total (m²)', type: 'number', step: '0.01', required: true },
      { name: 'tipo_lote', label: 'Tipo de Lote', type: 'select', options: ['urbano', 'rural', 'industrial'] },
      { name: 'topografia', label: 'Topografía', type: 'select', options: ['plano', 'inclinado', 'irregular'] },
      { name: 'servicios_disponibles', label: 'Servicios Disponibles', type: 'text' },
      { name: 'uso_suelo', label: 'Uso del Suelo', type: 'text' },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' }
    ]
  }

  // Resetear características específicas cuando cambia el tipo
  useEffect(() => {
    setCaracteristicasEspecificas({})
  }, [formDataComun.tipo_inmueble])

  const handleCommonChange = (e) => {
    const { name, value } = e.target
    setFormDataComun(prev => ({ ...prev, [name]: value }))
  }

  const handleUbicacionChange = (e) => {
    const { name, value } = e.target
    setUbicacion(prev => ({ ...prev, [name]: value }))
  }

  const handleServiciosChange = (e) => {
    const { name, checked } = e.target
    setServicios(prev => ({ ...prev, [name]: checked }))
  }

  const handleEspecificasChange = (e) => {
    const { name, value, type, checked } = e.target
    setCaracteristicasEspecificas(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || '' : value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones
    if (!formDataComun.valor || !ubicacion.municipio) {
      setError('Por favor completa los campos obligatorios')
      setLoading(false)
      return
    }

    try {
      const dataToSend = {
        ...formDataComun,
        valor: parseFloat(formDataComun.valor),
        estrato: parseInt(formDataComun.estrato),
        numero_matricula: formDataComun.numero_matricula || `MAT-${Date.now()}`,
        ubicacion,
        servicios,
        caracteristicas: caracteristicasEspecificas
      }

      // Endpoint según rol
      const endpoint = user.rol === 'admin' ? '/api/inmuebles-admin' : '/api/inmuebles'
      
      await axios.post(endpoint, dataToSend)

      alert(user.rol === 'admin' 
        ? '¡Propiedad publicada exitosamente!' 
        : '¡Propiedad enviada para revisión!')
      
      navigate('/')
    } catch (error) {
      console.error('Error completo:', error)
      console.error('Respuesta del servidor:', error.response?.data)
      
      let errorMessage = 'Error al enviar la propiedad'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.detalles) {
        errorMessage = error.response.data.detalles
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      
      // Mostrar también en alert para debugging
      alert(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const camposActuales = camposPorTipo[formDataComun.tipo_inmueble] || []

  return (
    <div className="publish-property-page">
      <div className="publish-container">
        <div className="publish-header">
          <h1>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.75rem', verticalAlign: 'middle' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Publicar Propiedad
          </h1>
          <p>
            {user?.rol === 'admin' 
              ? 'Completa el formulario para publicar la propiedad inmediatamente'
              : 'Completa el formulario y envíalo para revisión del administrador'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="publish-form">
          {error && (
            <div className="error-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          {/* INFORMACIÓN BÁSICA */}
          <div className="form-section">
            <h3>Información Básica</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipo_inmueble">Tipo de Inmueble *</label>
                <select
                  id="tipo_inmueble"
                  name="tipo_inmueble"
                  value={formDataComun.tipo_inmueble}
                  onChange={handleCommonChange}
                  disabled={loading}
                  required
                >
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="apartaestudio">Apartaestudio</option>
                  <option value="local">Local</option>
                  <option value="bodega">Bodega</option>
                  <option value="finca">Finca</option>
                  <option value="lote">Lote</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipo_operacion">Tipo de Operación *</label>
                <select
                  id="tipo_operacion"
                  name="tipo_operacion"
                  value={formDataComun.tipo_operacion}
                  onChange={handleCommonChange}
                  disabled={loading}
                  required
                >
                  <option value="venta">Venta</option>
                  <option value="arriendo">Arriendo</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="valor">Precio *</label>
              <input
                type="number"
                id="valor"
                name="valor"
                placeholder="Ej: 250000000"
                value={formDataComun.valor}
                onChange={handleCommonChange}
                disabled={loading}
                required
                min="0"
                step="0.01"
              />
              <small>Ingresa el precio en pesos colombianos</small>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe la propiedad..."
                value={formDataComun.descripcion}
                onChange={handleCommonChange}
                disabled={loading}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estado_inmueble">Estado del Inmueble</label>
                <select
                  id="estado_inmueble"
                  name="estado_inmueble"
                  value={formDataComun.estado_inmueble}
                  onChange={handleCommonChange}
                  disabled={loading}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                  <option value="remodelado">Remodelado</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="estado_conservacion">Estado de Conservación</label>
                <select
                  id="estado_conservacion"
                  name="estado_conservacion"
                  value={formDataComun.estado_conservacion}
                  onChange={handleCommonChange}
                  disabled={loading}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                  <option value="remodelado">Remodelado</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estrato">Estrato</label>
                <select
                  id="estrato"
                  name="estrato"
                  value={formDataComun.estrato}
                  onChange={handleCommonChange}
                  disabled={loading}
                >
                  {[1, 2, 3, 4, 5, 6].map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* UBICACIÓN */}
          <div className="form-section">
            <h3>Ubicación</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="municipio">Municipio/Ciudad *</label>
                <input
                  type="text"
                  id="municipio"
                  name="municipio"
                  placeholder="Ej: Medellín"
                  value={ubicacion.municipio}
                  onChange={handleUbicacionChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="barrio_vereda">Barrio/Vereda</label>
                <input
                  type="text"
                  id="barrio_vereda"
                  name="barrio_vereda"
                  placeholder="Ej: El Poblado"
                  value={ubicacion.barrio_vereda}
                  onChange={handleUbicacionChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección Completa</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Ej: Calle 123 #45-67"
                value={ubicacion.direccion}
                onChange={handleUbicacionChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* SERVICIOS PÚBLICOS */}
          <div className="form-section">
            <h3>Servicios Públicos</h3>
            <div className="features-grid">
              {Object.keys(servicios).map(servicio => (
                <label key={servicio} className="feature-checkbox">
                  <input
                    type="checkbox"
                    name={servicio}
                    checked={servicios[servicio]}
                    onChange={handleServiciosChange}
                    disabled={loading}
                  />
                  <span>{servicio.charAt(0).toUpperCase() + servicio.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* CARACTERÍSTICAS ESPECÍFICAS */}
          <div className="form-section">
            <h3>Características de {formDataComun.tipo_inmueble.charAt(0).toUpperCase() + formDataComun.tipo_inmueble.slice(1)}</h3>
            
            {camposActuales.map(campo => (
              <div key={campo.name} className="form-group">
                <label htmlFor={campo.name}>
                  {campo.label} {campo.required && '*'}
                </label>
                
                {campo.type === 'select' ? (
                  <select
                    id={campo.name}
                    name={campo.name}
                    value={caracteristicasEspecificas[campo.name] || ''}
                    onChange={handleEspecificasChange}
                    disabled={loading}
                    required={campo.required}
                  >
                    <option value="">Seleccionar...</option>
                    {campo.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : campo.type === 'checkbox' ? (
                  <label className="feature-checkbox">
                    <input
                      type="checkbox"
                      name={campo.name}
                      checked={caracteristicasEspecificas[campo.name] || false}
                      onChange={handleEspecificasChange}
                      disabled={loading}
                    />
                    <span>Sí</span>
                  </label>
                ) : campo.type === 'textarea' ? (
                  <textarea
                    id={campo.name}
                    name={campo.name}
                    value={caracteristicasEspecificas[campo.name] || ''}
                    onChange={handleEspecificasChange}
                    disabled={loading}
                    rows="3"
                    required={campo.required}
                  />
                ) : (
                  <input
                    type={campo.type}
                    id={campo.name}
                    name={campo.name}
                    value={caracteristicasEspecificas[campo.name] || ''}
                    onChange={handleEspecificasChange}
                    disabled={loading}
                    step={campo.step}
                    required={campo.required}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                user?.rol === 'admin' ? 'Publicando...' : 'Enviando...'
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  {user?.rol === 'admin' ? 'Publicar Propiedad' : 'Enviar para Revisión'}
                </>
              )}
            </button>
          </div>

          {user?.rol !== 'admin' && (
            <div className="form-note">
              <p>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <strong>Nota:</strong> Tu propiedad será revisada por un administrador antes de ser publicada.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default PublishProperty
