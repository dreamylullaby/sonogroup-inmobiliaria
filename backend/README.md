# Backend - Sistema de Gestión de Inmuebles

Backend en Node.js con Express y Supabase para el sistema de gestión de inmuebles.

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales de Supabase:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales.

### 3. Ejecutar el servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Endpoints de la API

### Autenticación

#### Registro de usuario
```http
POST /api/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "3001234567",
  "password": "mipassword123",
  "rol": "usuario"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "mipassword123"
}
```

**Respuesta:**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario"
  }
}
```

### Inmuebles

#### Listar todos los inmuebles
```http
GET /api/inmuebles?tipo_inmueble=casa&tipo_operacion=venta&limit=10&offset=0
```

#### Obtener un inmueble específico
```http
GET /api/inmuebles/:id
```

#### Crear un nuevo inmueble (requiere autenticación)
```http
POST /api/inmuebles
Authorization: Bearer <token>
Content-Type: application/json

{
  "valor": 350000000,
  "estrato": 4,
  "descripcion": "Hermosa casa de dos pisos",
  "numero_matricula": "MAT-001-2024",
  "tipo_operacion": "venta",
  "tipo_inmueble": "casa",
  "estado_inmueble": "usado",
  "zona": "urbano",
  "estado_conservacion": "remodelado",
  "ubicacion": {
    "direccion": "Carrera 45 #123-45",
    "barrio_vereda": "El Poblado",
    "municipio": "Medellín",
    "departamento": "Antioquia",
    "tipo_via": "Carrera"
  },
  "servicios": {
    "acueducto": true,
    "energia": true,
    "alcantarillado": true,
    "gas": true,
    "internet": true
  },
  "caracteristicas": {
    "area_frente": 8.5,
    "area_fondo": 15.0,
    "anos_construccion": 15,
    "metros_cuadrados": 180,
    "pisos": 2,
    "habitaciones": 4,
    "banos": 3,
    "patio": true,
    "jardin": true,
    "sala_comedor": "sala-comedor",
    "cocina": "integral",
    "zona_lavado": "interna",
    "parqueadero": "cubierto"
  }
}
```

#### Actualizar un inmueble (requiere autenticación)
```http
PUT /api/inmuebles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "valor": 360000000,
  "descripcion": "Hermosa casa de dos pisos - ACTUALIZADA"
}
```

#### Eliminar un inmueble (requiere autenticación)
```http
DELETE /api/inmuebles/:id
Authorization: Bearer <token>
```

### Usuarios

#### Obtener perfil del usuario autenticado
```http
GET /api/usuarios/perfil
Authorization: Bearer <token>
```

#### Obtener inmuebles del usuario autenticado
```http
GET /api/usuarios/mis-inmuebles
Authorization: Bearer <token>
```

#### Actualizar perfil
```http
PUT /api/usuarios/perfil
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Juan Pérez Actualizado",
  "telefono": "3009876543"
}
```

#### Listar todos los usuarios (solo admin)
```http
GET /api/usuarios
Authorization: Bearer <token>
```

### Fotografías

#### Obtener fotografías de un inmueble
```http
GET /api/fotografias/inmueble/:id_inmueble
```

#### Agregar fotografía (requiere autenticación)
```http
POST /api/fotografias
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_inmueble": 1,
  "url_foto": "/images/casa1/fachada.jpg",
  "descripcion": "Fachada principal",
  "orden": 1
}
```

#### Actualizar fotografía (requiere autenticación)
```http
PUT /api/fotografias/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "descripcion": "Nueva descripción",
  "orden": 2
}
```

#### Eliminar fotografía (requiere autenticación)
```http
DELETE /api/fotografias/:id
Authorization: Bearer <token>
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a rutas protegidas:

1. Obtén un token mediante login o registro
2. Incluye el token en el header `Authorization`:
   ```
   Authorization: Bearer <tu_token>
   ```

## 👥 Roles de Usuario

- **usuario**: Usuario regular, puede crear y gestionar sus propios inmuebles
- **admin**: Administrador, tiene acceso completo a todos los recursos
- **cliente**: Cliente que puede ver inmuebles

## 🛠️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Configuración de Supabase
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación
│   │   └── errorHandler.js     # Manejo de errores
│   ├── routes/
│   │   ├── auth.routes.js       # Rutas de autenticación
│   │   ├── inmuebles.routes.js  # Rutas de inmuebles
│   │   ├── usuarios.routes.js   # Rutas de usuarios
│   │   └── fotografias.routes.js # Rutas de fotografías
│   └── server.js                # Archivo principal
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 📝 Notas Importantes

1. **Seguridad**: Cambia el `JWT_SECRET` en producción por un valor seguro
2. **CORS**: El servidor acepta peticiones de cualquier origen. En producción, configura CORS apropiadamente
3. **Validación**: Se recomienda agregar validación de datos más robusta (ej: usando Joi o Zod)
4. **Rate Limiting**: Considera agregar rate limiting para prevenir abuso de la API

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que tu proyecto de Supabase esté activo
- Verifica que las tablas existan en tu base de datos

### Error de token inválido
- Verifica que el token no haya expirado (duración: 7 días)
- Asegúrate de incluir el prefijo "Bearer " en el header

## 📦 Dependencias Principales

- **express**: Framework web
- **@supabase/supabase-js**: Cliente de Supabase
- **jsonwebtoken**: Manejo de JWT
- **bcryptjs**: Hash de contraseñas
- **cors**: Manejo de CORS
- **dotenv**: Variables de entorno
