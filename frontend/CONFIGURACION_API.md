# Configuración de API - Frontend

## Variables de Entorno

El frontend ahora usa variables de entorno para conectarse al backend, lo que permite cambiar fácilmente entre desarrollo y producción.

### Archivo `.env`

Crea un archivo `.env` en la raíz del frontend con:

```env
# Local Development Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000
```

### Variables Disponibles

- **`VITE_API_BASE_URL`**: URL base para las peticiones API (incluye `/api`)
- **`VITE_API_URL`**: URL del servidor backend (sin `/api`)

## Uso en el Código

### Importar la configuración:

```javascript
import { API_URL, API_BASE_URL, getApiUrl } from '../config/api'
```

### Axios ya está configurado automáticamente:

En `AuthContext.jsx` se configura axios globalmente:

```javascript
axios.defaults.baseURL = API_URL
```

Esto significa que todas las peticiones axios usarán automáticamente la URL configurada:

```javascript
// Esto hace una petición a: http://localhost:3000/api/auth/login
axios.post('/api/auth/login', { email, password })
```

## Configuración para Producción

1. Crea un archivo `.env.production`:

```env
VITE_API_BASE_URL=https://tu-api-produccion.com/api
VITE_API_URL=https://tu-api-produccion.com
```

2. Vite automáticamente usará `.env.production` cuando ejecutes:

```bash
npm run build
```

## Configuración Actual

### Desarrollo Local:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`
- **Base de datos**: Supabase (nube)

### Flujo de Peticiones:
```
Frontend (5173) → Backend (3000) → Supabase
```

## Notas Importantes

- ⚠️ El archivo `.env` NO debe subirse a Git (ya está en `.gitignore`)
- ✅ El archivo `.env.example` SÍ debe subirse como referencia
- 🔄 Reinicia el servidor de desarrollo después de cambiar `.env`
- 📝 Las variables deben empezar con `VITE_` para ser accesibles en el código

## Comandos

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run preview
```
