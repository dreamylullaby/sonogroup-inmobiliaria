# 🏠 Backend - Sistema de Gestión de Inmuebles

Backend completo en Node.js con Express y Supabase para gestionar propiedades inmobiliarias.

## ✅ ¿Qué se ha creado?

He creado un backend completo con:

- ✅ **Servidor Express** configurado con todas las rutas
- ✅ **Autenticación JWT** con registro y login
- ✅ **CRUD completo** para inmuebles, usuarios y fotografías
- ✅ **Middleware de seguridad** con roles y permisos
- ✅ **Integración con Supabase** usando tu base de datos
- ✅ **Documentación completa** de la API

## 📋 Pasos para usar el backend

### 1️⃣ Crear las tablas en Supabase

Antes de usar el backend, necesitas ejecutar el esquema SQL en tu base de datos Supabase:

1. Ve a tu proyecto de Supabase: https://idtnuwpyfbnrejkzbmbg.supabase.co
2. Haz clic en **SQL Editor** en el menú lateral
3. Copia el contenido del archivo `schema.sql` (en la carpeta raíz)
4. Pégalo en el editor SQL y haz clic en **Run**
5. (Opcional) Ejecuta también `sample_data.sql` para tener datos de prueba

### 2️⃣ Iniciar el servidor

```bash
# Navegar a la carpeta del backend
cd backend

# Iniciar en modo desarrollo
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### 3️⃣ Probar la API

Puedes usar el archivo `test-api.http` para probar todos los endpoints. Si usas VS Code, instala la extensión **REST Client** para ejecutar las peticiones directamente.

O usa herramientas como:
- **Postman**
- **Insomnia**
- **Thunder Client** (extensión de VS Code)
- **curl** desde la terminal

## 🚀 Ejemplo rápido de uso

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "mipassword123",
    "telefono": "3001234567"
  }'
```

**Respuesta:**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario"
  }
}
```

### 2. Listar inmuebles

```bash
curl http://localhost:3000/api/inmuebles
```

### 3. Crear un inmueble (con token)

```bash
curl -X POST http://localhost:3000/api/inmuebles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "valor": 350000000,
    "estrato": 4,
    "descripcion": "Hermosa casa",
    "tipo_operacion": "venta",
    "tipo_inmueble": "casa",
    "estado_inmueble": "usado",
    "zona": "urbano",
    "estado_conservacion": "remodelado"
  }'
```

## 📁 Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Configuración de Supabase
│   ├── middleware/
│   │   ├── auth.js              # Autenticación JWT
│   │   └── errorHandler.js      # Manejo de errores
│   ├── routes/
│   │   ├── auth.routes.js       # Registro y login
│   │   ├── inmuebles.routes.js  # CRUD de inmuebles
│   │   ├── usuarios.routes.js   # Gestión de usuarios
│   │   └── fotografias.routes.js # Gestión de fotos
│   └── server.js                # Servidor principal
├── .env                         # Variables de entorno (YA CONFIGURADO)
├── package.json
├── test-api.http                # Pruebas de la API
└── README.md                    # Documentación completa
```

## 🔑 Endpoints principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/registro` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/inmuebles` | Listar inmuebles | No |
| GET | `/api/inmuebles/:id` | Ver un inmueble | No |
| POST | `/api/inmuebles` | Crear inmueble | Sí |
| PUT | `/api/inmuebles/:id` | Actualizar inmueble | Sí |
| DELETE | `/api/inmuebles/:id` | Eliminar inmueble | Sí |
| GET | `/api/usuarios/perfil` | Ver mi perfil | Sí |
| GET | `/api/usuarios/mis-inmuebles` | Mis inmuebles | Sí |
| POST | `/api/fotografias` | Agregar foto | Sí |

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)**. Para rutas protegidas:

1. Haz login o registro para obtener un token
2. Incluye el token en el header:
   ```
   Authorization: Bearer <tu_token>
   ```

## 👥 Roles

- **usuario**: Puede crear y gestionar sus propios inmuebles
- **admin**: Acceso completo a todos los recursos
- **cliente**: Solo puede ver inmuebles

## ⚙️ Variables de entorno

El archivo `.env` ya está configurado con tus credenciales de Supabase:

```env
SUPABASE_URL=https://idtnuwpyfbnrejkzbmbg.supabase.co
SUPABASE_ANON_KEY=tu_api_key
PORT=3000
JWT_SECRET=tu_secreto_jwt
```

## 📝 Notas importantes

1. **Primero ejecuta el schema.sql** en Supabase antes de usar el backend
2. El archivo `.env` ya tiene tus credenciales configuradas
3. En producción, cambia el `JWT_SECRET` por algo más seguro
4. Las contraseñas se hashean automáticamente con bcrypt

## 🐛 Solución de problemas

### "Error al conectar con Supabase"
- Verifica que ejecutaste `schema.sql` en Supabase
- Revisa que las credenciales en `.env` sean correctas

### "Token inválido"
- El token expira en 7 días
- Asegúrate de incluir "Bearer " antes del token

## 📚 Documentación completa

Para más detalles, consulta el archivo `README.md` completo en la carpeta backend.

## 🎯 Próximos pasos sugeridos

1. ✅ Ejecutar `schema.sql` en Supabase
2. ✅ Iniciar el servidor con `npm run dev`
3. ✅ Probar el registro y login
4. ✅ Crear algunos inmuebles de prueba
5. 🔜 Crear un frontend para consumir esta API
