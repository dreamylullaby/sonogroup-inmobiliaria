# 🚀 Instrucciones para Iniciar el Proyecto

## Requisitos Previos

- Node.js instalado (v16 o superior)
- npm o yarn
- Cuenta de Supabase configurada

## Configuración Inicial

### 1. Backend

#### Instalar dependencias:
```bash
cd backend
npm install
```

#### Configurar variables de entorno:
Crea un archivo `.env` en la carpeta `backend` con:

```env
# Configuración de Supabase
SUPABASE_URL=https://idtnuwpyfbnrejkzbmbg.supabase.co
SUPABASE_ANON_KEY=tu_clave_anon_aqui

# Configuración del servidor
PORT=3000
NODE_ENV=development

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
```

#### Iniciar el backend:
```bash
npm run dev
```

El backend estará corriendo en: `http://localhost:3000`

### 2. Frontend

#### Instalar dependencias:
```bash
cd frontend
npm install
```

#### Configurar variables de entorno:
Crea un archivo `.env` en la carpeta `frontend` con:

```env
# Local Development Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000
```

#### Iniciar el frontend:
```bash
npm run dev
```

El frontend estará corriendo en: `http://localhost:5173`

## Orden de Inicio

⚠️ **IMPORTANTE**: Debes iniciar los servicios en este orden:

1. **Primero**: Backend (puerto 3000)
2. **Segundo**: Frontend (puerto 5173)

## Verificar que Todo Funciona

### 1. Verificar Backend:
Abre en tu navegador: `http://localhost:3000`

Deberías ver un JSON con información de la API:
```json
{
  "mensaje": "🏠 API de Gestión de Inmuebles",
  "version": "1.0.0",
  ...
}
```

### 2. Verificar Frontend:
Abre en tu navegador: `http://localhost:5173`

Deberías ver la página principal de SonoGroup Inmobiliaria.

### 3. Verificar Conexión:
- Ve a la página de "Propiedades"
- Si ves propiedades cargadas, todo está funcionando correctamente
- Si ves un error, verifica que el backend esté corriendo

## Solución de Problemas

### Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

**Causa**: El backend no está corriendo o el frontend no puede conectarse.

**Solución**:
1. Verifica que el backend esté corriendo en el puerto 3000
2. Verifica que el archivo `frontend/.env` tenga las URLs correctas
3. Reinicia ambos servidores

### Error: "EADDRINUSE: address already in use"

**Causa**: El puerto ya está siendo usado por otro proceso.

**Solución**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error de CORS

**Causa**: El backend no está permitiendo peticiones del frontend.

**Solución**: Verifica que en `backend/src/server.js` esté configurado:
```javascript
app.use(cors());
```

## Scripts Útiles

### Backend:
```bash
npm start      # Iniciar en modo producción
npm run dev    # Iniciar en modo desarrollo (con auto-reload)
```

### Frontend:
```bash
npm run dev    # Iniciar servidor de desarrollo
npm run build  # Compilar para producción
npm run preview # Vista previa de la compilación
```

## Estructura de Puertos

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`
- **Base de datos**: Supabase (nube)

## Flujo de Datos

```
Usuario → Frontend (5173) → Backend (3000) → Supabase (PostgreSQL)
```

## Notas Importantes

- ⚠️ Nunca subas los archivos `.env` a Git
- ✅ Los archivos `.env.example` sí deben estar en Git como referencia
- 🔄 Reinicia el servidor después de cambiar variables de entorno
- 📝 Las variables de Vite deben empezar con `VITE_`

## Comandos Rápidos

### Iniciar todo desde la raíz del proyecto:

**Terminal 1 (Backend)**:
```bash
cd backend && npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend && npm run dev
```

## Acceso a la Aplicación

Una vez iniciados ambos servidores:

1. Abre tu navegador en: `http://localhost:5173`
2. Para probar el login de admin, usa las credenciales configuradas en tu base de datos
3. Para registrar un nuevo usuario, ve a la página de registro

¡Listo! Tu aplicación debería estar funcionando correctamente. 🎉
