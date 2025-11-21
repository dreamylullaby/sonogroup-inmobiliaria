# 🧪 Cómo Probar el Sistema de Publicación de Propiedades

## ✅ Requisitos Previos

1. **Backend corriendo:** `http://localhost:3000`
2. **Frontend corriendo:** `http://localhost:5175`
3. **Tabla creada en Supabase:** `propiedades_pendientes`

---

## 📋 Crear la Tabla en Supabase

Si aún no has creado la tabla, ejecuta este SQL en Supabase:

```sql
CREATE TABLE IF NOT EXISTS propiedades_pendientes (
    id_propiedad_pendiente SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    precio DECIMAL(12, 2) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    habitaciones INTEGER,
    banos INTEGER,
    area DECIMAL(10, 2),
    imagen TEXT,
    caracteristicas TEXT,
    estado_aprobacion VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_aprobacion IN ('pendiente', 'aprobado', 'rechazado')),
    motivo_rechazo TEXT,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_revision TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_propiedades_pendientes_usuario ON propiedades_pendientes(id_usuario);
CREATE INDEX IF NOT EXISTS idx_propiedades_pendientes_estado ON propiedades_pendientes(estado_aprobacion);
```

---

## 🧪 Pasos para Probar

### 1️⃣ **Como Usuario (Cliente)**

#### A. Registrarse o Iniciar Sesión:
```
1. Ve a: http://localhost:5175/registro
2. Crea una cuenta con rol "usuario"
   - Nombre: Test Usuario
   - Email: usuario@test.com
   - Password: 123456
3. Serás redirigido al home logueado
```

#### B. Publicar una Propiedad:
```
1. En el navbar, click en "Publicar" (o ve a /publicar)
2. Completa el formulario:

   Información Básica:
   - Título: Casa moderna en el centro
   - Descripción: Hermosa casa con acabados de lujo
   - Tipo de Inmueble: Casa
   - Tipo de Operación: Venta
   - Precio: 250000

   Ubicación:
   - Ciudad/Zona: Centro, Bogotá
   - Dirección: Calle 123 #45-67

   Tamaño y Detalles:
   - Área en m²: 150
   - Habitaciones: 3
   - Baños: 2

   Características (selecciona algunas):
   ☑ Garage
   ☑ Piscina
   ☑ Jardín
   ☑ Aire acondicionado

   Característica personalizada:
   - Agregar: "Vista panorámica"

   Imagen:
   - Selecciona una imagen desde tu PC

3. Click en "Enviar para Revisión"
4. Verás mensaje: "¡Propiedad enviada para revisión!"
```

---

### 2️⃣ **Como Administrador**

#### A. Iniciar Sesión como Admin:
```
1. Cierra sesión si estás logueado
2. Ve a: http://localhost:5175/login
3. Inicia sesión con:
   - Email: admin@inmuebles.com
   - Password: admin123
```

#### B. Ver Propiedades Pendientes:
```
1. En el navbar, click en "Panel Admin"
2. Click en la pestaña "Propiedades Pendientes"
3. Verás la propiedad que enviaste como usuario
4. Deberías ver:
   - Imagen de la propiedad
   - Título: Casa moderna en el centro
   - Usuario: Test Usuario (usuario@test.com)
   - Precio: $250,000
   - Ubicación: Centro, Bogotá
   - Características: 3 hab, 2 baños, 150m²
   - Botones: "Aprobar" y "Rechazar"
```

#### C. Aprobar la Propiedad:
```
1. Click en "✓ Aprobar"
2. Confirma la acción
3. La propiedad se publicará en la tabla principal
4. Desaparecerá de "Propiedades Pendientes"
5. Aparecerá en la página principal (/)
```

#### D. O Rechazar la Propiedad:
```
1. Click en "✗ Rechazar"
2. Escribe un motivo: "Faltan documentos"
3. La propiedad se marcará como rechazada
4. El usuario podrá ver el motivo
```

---

## 🔍 Verificar en Base de Datos

### En Supabase:

1. **Ver propiedades pendientes:**
```sql
SELECT * FROM propiedades_pendientes 
ORDER BY fecha_solicitud DESC;
```

2. **Ver propiedades aprobadas:**
```sql
SELECT * FROM inmuebles 
ORDER BY fecha_publicacion DESC;
```

3. **Ver con información del usuario:**
```sql
SELECT 
    pp.*,
    u.nombre,
    u.email
FROM propiedades_pendientes pp
JOIN usuarios u ON pp.id_usuario = u.id_usuario
WHERE pp.estado_aprobacion = 'pendiente';
```

---

## 📊 Flujo Completo

```
Usuario                          Admin
   |                               |
   | 1. Completa formulario        |
   | 2. Envía propiedad            |
   |------------------------------>|
   |                               | 3. Ve en "Pendientes"
   |                               | 4. Revisa información
   |                               | 5. Decide: Aprobar/Rechazar
   |                               |
   | 6. Si aprobado:               |
   |    - Aparece en home          |
   |    - Visible para todos       |
   |<------------------------------|
   |                               |
   | 7. Si rechazado:              |
   |    - Ve motivo                |
   |    - Puede editar y reenviar  |
   |<------------------------------|
```

---

## 🎯 Endpoints del Backend

### Usuario:
```
POST   /api/propiedades-pendientes
       - Crear solicitud de propiedad
       - Requiere: token de usuario

GET    /api/propiedades-pendientes/mis-propiedades
       - Ver mis propiedades enviadas
       - Requiere: token de usuario
```

### Admin:
```
GET    /api/propiedades-pendientes
       - Ver todas las propiedades pendientes
       - Requiere: token de admin

PUT    /api/propiedades-pendientes/:id/aprobar
       - Aprobar y publicar propiedad
       - Requiere: token de admin

PUT    /api/propiedades-pendientes/:id/rechazar
       - Rechazar propiedad con motivo
       - Requiere: token de admin
```

---

## ✅ Checklist de Prueba

### Como Usuario:
- [ ] Puedo acceder a /publicar
- [ ] Puedo completar el formulario
- [ ] Puedo seleccionar características
- [ ] Puedo agregar características personalizadas
- [ ] Puedo subir una imagen
- [ ] Veo vista previa de la imagen
- [ ] Puedo enviar el formulario
- [ ] Veo mensaje de confirmación
- [ ] Soy redirigido al home

### Como Admin:
- [ ] Veo la pestaña "Propiedades Pendientes"
- [ ] Veo el contador de pendientes
- [ ] Veo la lista de propiedades
- [ ] Veo información del usuario
- [ ] Veo imagen de la propiedad
- [ ] Veo todas las características
- [ ] Puedo aprobar propiedades
- [ ] Puedo rechazar propiedades
- [ ] Las propiedades aprobadas aparecen en home

---

## 🐛 Solución de Problemas

### Error: "No se puede enviar"
- Verifica que estés logueado como usuario
- Verifica que el backend esté corriendo
- Revisa la consola del navegador

### Error: "No veo propiedades pendientes"
- Verifica que estés logueado como admin
- Verifica que la tabla exista en Supabase
- Verifica que haya propiedades enviadas

### Error: "La imagen no se sube"
- Verifica que sea menor a 5MB
- Verifica que sea un archivo de imagen
- Por ahora, la imagen se guarda como base64

---

## 📝 Notas Importantes

1. **Imágenes:** Actualmente se guardan como base64 en la BD. Para producción, considera usar un servicio de almacenamiento como Supabase Storage o Cloudinary.

2. **Validaciones:** El backend valida campos obligatorios (título, precio, ubicación, área).

3. **Permisos:** Solo usuarios con rol "usuario" pueden publicar. Los admins pueden ver y gestionar.

4. **Estados:** Las propiedades pueden estar en:
   - `pendiente`: Esperando revisión
   - `aprobado`: Publicada en el sitio
   - `rechazado`: Rechazada con motivo

---

¡Todo listo para probar! 🎉

Sigue los pasos y verás cómo funciona el flujo completo de publicación de propiedades.
