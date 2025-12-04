# 🔐 Sistema de Login de Administrador

## ✅ Todo está listo!

He creado el sistema completo de autenticación para administrador. Aquí está todo lo que necesitas saber:

---

## 🚀 Cómo Usar

### 1. Asegúrate de que el Backend esté corriendo

```bash
cd backend
npm run dev
```

El backend debe estar en: `http://localhost:3000`

### 2. El Frontend ya está corriendo

El frontend está en: `http://localhost:5173`

### 3. Credenciales de Administrador

Ya he creado un usuario administrador para ti:

- **Email:** `admin@inmuebles.com`
- **Password:** `admin123`

---

## 🎯 Rutas Disponibles

### Frontend:

- **`/`** - Página principal (pública)
- **`/login`** - Página de inicio de sesión
- **`/admin`** - Panel de administración (solo admin)

### Backend:

- **POST `/api/auth/login`** - Iniciar sesión
- **POST `/api/auth/registro`** - Registrar usuario
- **GET `/api/usuarios`** - Ver usuarios (solo admin)
- **DELETE `/api/usuarios/:id`** - Eliminar usuario (solo admin)

---

## 📁 Archivos Creados

### Frontend:

```
frontend/src/
├── context/
│   └── AuthContext.jsx          # Manejo de autenticación global
├── components/
│   ├── ProtectedRoute.jsx       # Protección de rutas
│   └── Navbar.jsx               # Actualizado con auth
├── pages/
│   ├── Login.jsx                # Página de login
│   ├── Login.css
│   ├── AdminDashboard.jsx       # Panel de administración
│   └── AdminDashboard.css
└── App.jsx                      # Actualizado con rutas
```

### Backend:

```
backend/
└── crear-admin.js               # Script para crear admin
```

---

## 🔑 Características Implementadas

### ✅ Autenticación:
- Login con email y password
- JWT tokens con expiración de 7 días
- Almacenamiento en localStorage
- Logout funcional

### ✅ Protección de Rutas:
- Rutas protegidas con `ProtectedRoute`
- Verificación de rol de administrador
- Redirección automática si no está autenticado

### ✅ Panel de Administración:
- Estadísticas de propiedades y usuarios
- Lista de todos los usuarios
- Eliminar usuarios
- Badges de roles (admin/usuario)
- Diseño responsive

### ✅ Navbar Inteligente:
- Muestra nombre del usuario cuando está logueado
- Botón de "Cerrar Sesión"
- Enlace al "Panel Admin" solo para administradores
- Botón de "Iniciar Sesión" cuando no está autenticado

### ✅ Seguridad:
- Passwords hasheados con bcrypt
- Tokens JWT firmados
- Middleware de verificación de roles
- Headers de autorización

---

## 🧪 Cómo Probar

### 1. Ir a la página de login:
```
http://localhost:5173/login
```

### 2. Iniciar sesión con:
- Email: `admin@inmuebles.com`
- Password: `admin123`

### 3. Serás redirigido al panel de administración:
```
http://localhost:5173/admin
```

### 4. En el panel verás:
- Estadísticas de propiedades
- Lista de usuarios
- Opciones para gestionar usuarios

---

## 🔧 Crear Más Administradores

Si necesitas crear otro usuario administrador:

```bash
cd backend
node crear-admin.js
```

O puedes usar la API directamente:

```bash
POST http://localhost:3000/api/auth/registro
Content-Type: application/json

{
  "nombre": "Nuevo Admin",
  "email": "nuevo@admin.com",
  "password": "password123",
  "rol": "admin"
}
```

---

## 🛡️ Seguridad

### Tokens JWT:
- Se almacenan en `localStorage`
- Se envían en el header `Authorization: Bearer <token>`
- Expiran en 7 días
- Contienen: id_usuario, email, rol

### Roles:
- **admin**: Acceso total al panel de administración
- **usuario**: Acceso limitado (solo sus propiedades)

---

## 📱 Responsive

Todo el sistema es completamente responsive:
- ✅ Móviles
- ✅ Tablets
- ✅ Desktop

---

## 🎨 Diseño

- Colores modernos con gradientes
- Animaciones suaves
- Iconos emoji para mejor UX
- Tablas responsivas
- Cards con estadísticas

---

## 🐛 Solución de Problemas

### Error: "Credenciales inválidas"
- Verifica que el email sea: `admin@inmuebles.com`
- Verifica que el password sea: `admin123`
- Asegúrate de que el backend esté corriendo

### Error: "No se puede conectar"
- Verifica que el backend esté en `http://localhost:3000`
- Verifica que el frontend esté en `http://localhost:5173`
- Revisa la configuración del proxy en `vite.config.js`

### No aparece el panel de admin
- Verifica que el usuario tenga rol "admin"
- Revisa la consola del navegador para errores
- Asegúrate de estar logueado

---

## 📞 Próximos Pasos

Puedes agregar:
- Página de registro
- Recuperación de contraseña
- Edición de usuarios
- Gestión de propiedades desde el admin
- Subida de imágenes
- Dashboard con gráficas

---

¡Todo listo para usar! 🎉
