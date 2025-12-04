# Sistema de Aprobación de Propiedades

## Resumen
Sistema completo que permite a usuarios normales publicar propiedades que deben ser aprobadas por un administrador antes de aparecer en el sitio público.

## Flujo de Trabajo

### Para Usuarios Normales

1. **Publicar Propiedad**
   - Usuario accede a `/publicar`
   - Completa el formulario de 4 pasos
   - Al enviar, la propiedad se guarda en `propiedades_pendientes`
   - Estado inicial: `pendiente`
   - Mensaje: "¡Propiedad enviada para revisión! El administrador la revisará pronto."

2. **Ver Mis Propiedades Pendientes**
   - Endpoint: `GET /api/propiedades-pendientes/mis-propiedades`
   - Muestra todas las propiedades del usuario con su estado
   - Estados posibles: `pendiente`, `aprobado`, `rechazado`

### Para Administradores

1. **Publicar Directamente**
   - Admin accede a `/publicar`
   - Completa el formulario
   - Al enviar, usa endpoint `/api/inmuebles-admin`
   - La propiedad se publica inmediatamente en `inmuebles`
   - No requiere aprobación

2. **Revisar Propiedades Pendientes**
   - Admin accede al panel admin (`/admin`)
   - Pestaña "Pendientes" muestra todas las propiedades pendientes
   - Puede ver detalles completos de cada propiedad
   - Información del usuario que la publicó

3. **Aprobar Propiedad**
   - Botón "Aprobar" en cada propiedad pendiente
   - Endpoint: `PUT /api/propiedades-pendientes/:id/aprobar`
   - Proceso:
     - Crea registro en tabla `inmuebles`
     - Crea registro en tabla `ubicaciones`
     - Crea registro en tabla `servicios_publicos`
     - Crea registro en tabla específica (`casas`, `apartamentos`, etc.)
     - Actualiza estado en `propiedades_pendientes` a `aprobado`
   - La propiedad ahora aparece en el sitio público

4. **Rechazar Propiedad**
   - Botón "Rechazar" en cada propiedad pendiente
   - Solicita motivo del rechazo
   - Endpoint: `PUT /api/propiedades-pendientes/:id/rechazar`
   - Actualiza estado a `rechazado` y guarda el motivo
   - El usuario puede ver el motivo del rechazo

5. **Editar Propiedades Publicadas**
   - Botón "Editar" en:
     - Página de detalles de la propiedad (header)
     - Panel admin, tabla de propiedades publicadas
   - Redirige a `/editar-propiedad/:id`
   - Carga todos los datos existentes
   - Permite modificar cualquier campo
   - Actualiza todas las tablas relacionadas

## Estructura de Datos

### Tabla: propiedades_pendientes
```sql
- id_propiedad_pendiente (PK)
- id_usuario (FK a usuarios)
- titulo
- descripcion
- tipo (tipo de inmueble)
- estado (estado del inmueble)
- precio
- ubicacion (municipio)
- direccion
- habitaciones
- banos
- area
- imagen
- caracteristicas (JSON con datos completos)
- estado_aprobacion ('pendiente', 'aprobado', 'rechazado')
- motivo_rechazo
- fecha_solicitud
- fecha_revision
```

### Campo caracteristicas (JSON)
Almacena todos los datos adicionales:
```json
{
  "tipo_operacion": "venta",
  "zona": "urbano",
  "estrato": 3,
  "estado_conservacion": "nuevo",
  "ubicacion_completa": {
    "direccion": "...",
    "barrio_vereda": "...",
    "municipio": "...",
    "departamento": "...",
    "tipo_via": "..."
  },
  "servicios": {
    "acueducto": true,
    "energia": true,
    "alcantarillado": true,
    "gas": false,
    "internet": false
  },
  "caracteristicas_especificas": {
    "metros_cuadrados": 100,
    "habitaciones": 3,
    "banos": 2,
    ...
  }
}
```

## Endpoints API

### Usuarios Normales

#### Crear Propiedad Pendiente
```
POST /api/inmuebles
Headers: Authorization: Bearer <token>
Body: {
  valor, estrato, descripcion, tipo_operacion, tipo_inmueble,
  estado_inmueble, zona, estado_conservacion,
  ubicacion, servicios, caracteristicas
}
Response: { mensaje, propiedad }
```

#### Ver Mis Propiedades Pendientes
```
GET /api/propiedades-pendientes/mis-propiedades
Headers: Authorization: Bearer <token>
Response: { propiedades: [...] }
```

### Administradores

#### Publicar Directamente
```
POST /api/inmuebles-admin
Headers: Authorization: Bearer <token>
Body: { ... mismo que usuarios }
Response: { mensaje, inmueble }
```

#### Ver Todas las Pendientes
```
GET /api/propiedades-pendientes
Headers: Authorization: Bearer <token>
Response: { propiedades: [...] }
```

#### Aprobar Propiedad
```
PUT /api/propiedades-pendientes/:id/aprobar
Headers: Authorization: Bearer <token>
Response: { mensaje, propiedad }
```

#### Rechazar Propiedad
```
PUT /api/propiedades-pendientes/:id/rechazar
Headers: Authorization: Bearer <token>
Body: { motivo: "..." }
Response: { mensaje, propiedad }
```

#### Editar Propiedad Publicada
```
PUT /api/inmuebles/:id
Headers: Authorization: Bearer <token>
Body: { ... datos actualizados }
Response: { mensaje, inmueble }
```

## Componentes Frontend

### PublishProperty.jsx
- Formulario de 4 pasos
- Soporta modo creación y edición
- Props: `editMode`, `propertyId`
- Detecta rol del usuario
- Envía a endpoint correcto según rol

### EditProperty.jsx
- Wrapper que verifica permisos de admin
- Renderiza `PublishProperty` en modo edición
- Ruta: `/editar-propiedad/:id`

### AdminDashboard.jsx
- Panel con 3 pestañas:
  - Usuarios
  - Propiedades Publicadas (con botón editar)
  - Pendientes (con botones aprobar/rechazar)

### PropertyDetail.jsx
- Muestra detalles completos de la propiedad
- Botón "Editar" visible solo para admin
- Cuadro de contacto oculto para admin

## Permisos y Seguridad

### Usuarios Normales
- ✅ Pueden publicar propiedades (van a pendientes)
- ✅ Pueden ver sus propias propiedades pendientes
- ✅ Pueden ver propiedades publicadas
- ✅ Pueden contactar sobre propiedades
- ❌ No pueden aprobar/rechazar
- ❌ No pueden editar propiedades publicadas
- ❌ No pueden publicar directamente

### Administradores
- ✅ Pueden publicar directamente (sin aprobación)
- ✅ Pueden ver todas las propiedades pendientes
- ✅ Pueden aprobar propiedades
- ✅ Pueden rechazar propiedades
- ✅ Pueden editar cualquier propiedad publicada
- ✅ Pueden eliminar propiedades
- ✅ No ven cuadro de contacto (no necesitan contactar)

## Validaciones

### Frontend
- Campos requeridos por paso
- Validación de campos numéricos
- Validación de campos específicos según tipo de inmueble
- Mensajes de error claros

### Backend
- Verificación de token JWT
- Verificación de rol para endpoints admin
- Validación de datos requeridos
- Verificación de permisos para editar/eliminar

## Notificaciones

### Usuario Normal
- "¡Propiedad enviada para revisión! El administrador la revisará pronto."
- Puede ver estado de sus propiedades pendientes

### Administrador
- Ve contador de propiedades pendientes en el panel
- Puede ver información del usuario que publicó

## Mejoras Futuras Sugeridas

1. **Notificaciones por Email**
   - Al usuario cuando su propiedad es aprobada/rechazada
   - Al admin cuando hay nueva propiedad pendiente

2. **Dashboard de Usuario**
   - Página donde el usuario vea sus propiedades pendientes
   - Estado de cada una
   - Motivo de rechazo si aplica

3. **Comentarios en Revisión**
   - Admin puede dejar comentarios/sugerencias
   - Usuario puede responder o corregir

4. **Historial de Cambios**
   - Registro de quién editó qué y cuándo
   - Útil para auditoría

5. **Imágenes**
   - Subida de múltiples imágenes
   - Gestión de galería de fotos

6. **Estadísticas**
   - Tiempo promedio de aprobación
   - Tasa de aprobación/rechazo
   - Propiedades más vistas
