# ✅ Configuración de Variables de Entorno - Frontend

## 📋 Cambios Realizados

### 1. **Archivos Creados**

#### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000
```
- ⚠️ **NO se sube a Git** (está en `.gitignore`)
- Contiene la configuración local de desarrollo

#### `frontend/.env.example`
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000
```
- ✅ **SÍ se sube a Git** como referencia
- Incluye ejemplos para producción comentados

#### `frontend/src/config/api.js`
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```
- Centraliza la configuración de la API
- Proporciona valores por defecto si no hay variables de entorno

### 2. **Archivos Modificados**

#### `frontend/vite.config.js`
**ANTES:**
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

**DESPUÉS:**
```javascript
server: {
  port: 5173
}
```
- ❌ Removido el proxy (ya no es necesario)
- ✅ Ahora usa variables de entorno directamente

#### `frontend/src/context/AuthContext.jsx`
**AGREGADO:**
```javascript
import { API_URL } from '../config/api'

// Configurar la URL base de axios
axios.defaults.baseURL = API_URL
```
- ✅ Axios ahora usa la URL del archivo de configuración
- ✅ Todas las peticiones axios usan automáticamente esta URL base

#### `frontend/.gitignore`
**AGREGADO:**
```
.env
```
- ✅ Protege las variables de entorno locales

### 3. **Documentación Creada**

- `frontend/CONFIGURACION_API.md` - Guía completa de uso
- `Docs/CONFIGURACION_VARIABLES_ENTORNO.md` - Este archivo

## 🔄 Cómo Funciona Ahora

### Flujo de Peticiones:

```
Frontend (localhost:5173)
    ↓
axios.post('/api/auth/login')
    ↓
axios.defaults.baseURL = 'http://localhost:3000'
    ↓
Petición real: http://localhost:3000/api/auth/login
    ↓
Backend (localhost:3000)
    ↓
Supabase (nube)
```

### Ejemplo de Petición:

```javascript
// En cualquier componente:
axios.post('/api/auth/login', { email, password })

// Se convierte automáticamente en:
// http://localhost:3000/api/auth/login
```

## 🚀 Cómo Usar

### Desarrollo Local:

1. **Asegúrate de tener el archivo `.env`:**
   ```bash
   cd frontend
   # Si no existe, cópialo del ejemplo:
   copy .env.example .env
   ```

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **El frontend se conectará automáticamente a:**
   - Backend: `http://localhost:3000`
   - API: `http://localhost:3000/api`

### Producción:

1. **Crea `.env.production`:**
   ```env
   VITE_API_BASE_URL=https://tu-api.com/api
   VITE_API_URL=https://tu-api.com
   ```

2. **Construye para producción:**
   ```bash
   npm run build
   ```

3. **Vite usará automáticamente las variables de producción**

## ✅ Ventajas de Este Sistema

### Flexibilidad:
- ✅ Fácil cambio entre desarrollo y producción
- ✅ No necesitas modificar código para cambiar URLs
- ✅ Cada desarrollador puede tener su propia configuración

### Seguridad:
- ✅ Las URLs sensibles no se suben a Git
- ✅ Cada entorno tiene su propia configuración
- ✅ Valores por defecto seguros en el código

### Mantenibilidad:
- ✅ Configuración centralizada en un solo lugar
- ✅ Fácil de documentar y compartir
- ✅ Menos errores al desplegar

## 🧪 Cómo Probar

1. **Verifica que el backend esté corriendo:**
   ```bash
   cd backend
   npm start
   # Debe estar en http://localhost:3000
   ```

2. **Inicia el frontend:**
   ```bash
   cd frontend
   npm run dev
   # Debe estar en http://localhost:5173
   ```

3. **Prueba el login:**
   - Ve a `http://localhost:5173/login`
   - Intenta iniciar sesión
   - Verifica en la consola del navegador que las peticiones vayan a `http://localhost:3000/api/...`

## 📝 Notas Importantes

### Variables de Entorno en Vite:
- ⚠️ **DEBEN empezar con `VITE_`** para ser accesibles en el código
- ⚠️ **Reinicia el servidor** después de cambiar `.env`
- ⚠️ Los cambios en `.env` **NO se aplican en caliente**

### Estructura de URLs:
```
VITE_API_URL=http://localhost:3000
    ↓
Petición: /api/auth/login
    ↓
URL Final: http://localhost:3000/api/auth/login
```

### Archivos que NO deben subirse a Git:
- ❌ `frontend/.env`
- ❌ `frontend/.env.local`
- ❌ `frontend/.env.production.local`

### Archivos que SÍ deben subirse a Git:
- ✅ `frontend/.env.example`
- ✅ `frontend/src/config/api.js`
- ✅ `frontend/CONFIGURACION_API.md`

## 🔧 Troubleshooting

### Error: "Network Error" o "ERR_CONNECTION_REFUSED"
**Causa:** El backend no está corriendo
**Solución:**
```bash
cd backend
npm start
```

### Error: Las variables de entorno no se cargan
**Causa:** No reiniciaste el servidor después de cambiar `.env`
**Solución:**
```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

### Error: "Cannot find module '../config/api'"
**Causa:** El archivo `api.js` no existe
**Solución:** Verifica que existe `frontend/src/config/api.js`

## 🎯 Resultado Final

Ahora tienes:
- ✅ Configuración flexible con variables de entorno
- ✅ Fácil cambio entre desarrollo y producción
- ✅ Código más limpio y mantenible
- ✅ Mejor seguridad (URLs no en el código)
- ✅ Documentación completa

¡El sistema está listo para desarrollo y producción! 🚀
