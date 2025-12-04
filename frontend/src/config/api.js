// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Helper para construir URLs de API
export const getApiUrl = (endpoint) => {
  // Si el endpoint ya incluye /api, usar API_URL
  if (endpoint.startsWith('/api')) {
    return `${API_URL}${endpoint}`
  }
  // Si no, usar API_BASE_URL
  return `${API_BASE_URL}${endpoint}`
}
