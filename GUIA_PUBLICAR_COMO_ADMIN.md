# 🎯 Guía Completa: Publicar Propiedad como Administrador

## ✅ Checklist Previo

Antes de probar, asegúrate de que todo esté funcionando:

### 1. Backend Corriendo
```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Conexión a Supabase exitosa
🚀 Servidor corriendo en http://localhost:3000
```

### 2. Frontend Corriendo
```bash
cd frontend
npm run dev
```

Deberías ver:
```
Local: http://localhost:5173/
```

### 3. Tener un Usuario Admin
Ejecuta el script para crear admin (si no lo has hecho):
```bash
cd backend
node crear-admin.js
```

Credenciales del admin:
- **Email:** admin@inmuebles.com
- **Password:** admin123

---

## 🚀 Pasos para Publicar como Admin

### Paso 1: Iniciar Sesión como Admin

1. Abre el navegador en `http://localhost:5173`
2. Haz clic en **"Iniciar Sesión"**
3. Ingresa las credenciales:
   - Email: `admin@inmuebles.com`
   - Password: `admin123`
4. Click en **"Iniciar Sesión"**

✅ Deberías ver tu nombre en el navbar y el botón **"Panel Admin"**

### Paso 2: Ir al Formulario de Publicación

1. En el navbar, haz clic en **"Publicar"**
2. Verás el formulario dinámico con el mensaje:
   > "Completa el formulario para publicar la propiedad inmediatamente"

### Paso 3: Completar el Formulario

#### 📋 Ejemplo: Publicar una Casa

**Información Básica:**
- Tipo de Inmueble: **Casa**
- Tipo de Operación: **Venta**
- Precio: **250000000** (250 millones)
- Descripción: **Hermosa casa moderna de dos pisos con jardín y piscina**
- Estado del Inmueble: **Nuevo**
- Estrato: **3**

**Ubicación:**
- Municipio/Ciudad: **Medellín**
- Barrio/Vereda: **El Poblado**
- Dirección Completa: **Calle 10 #45-67**

**Servicios Públicos:**
- ✅ Acueducto
- ✅ Energía
- ✅ Alcantarillado
- ✅ Gas
- ✅ Internet

**Características de Casa:**
- Área Frente: **8.5**
- Área Fondo: **15**
- Años de Construcción: **5**
- Metros Cuadrados: **150** ⭐ (obligatorio)
- Número de Pisos: **2**
- Habitaciones: **3**
- Baños: **2**
- ✅ Patio
- ✅ Jardín
- Sala/Comedor: **sala-comedor**
- Cocina: **integral**
- Zona de Lavado: **interna**
- Parqueadero: **cubierto**

### Paso 4: Publicar

1. Revisa que todos los campos obligatorios estén completos
2. Haz clic en **"Publicar Propiedad"**
3. Verás el mensaje: **"Publicando..."**
4. Luego aparecerá: **"¡Propiedad publicada exitosamente!"**
5. Serás redirigido a la página de inicio

### Paso 5: Verificar la Publicación

#### En el Frontend:
1. Ve a la página de inicio
2. Deberías ver tu propiedad publicada inmediatamente
3. Verifica que aparezca con todos los datos

#### En la Base de Datos (Supabase):

**Tabla `inmuebles`:**
```sql
SELECT * FROM inmuebles ORDER BY fecha_registro DESC LIMIT 1;
```

Deberías ver:
- valor: 250000000
- tipo_inmueble: casa
- tipo_operacion: venta
- descripcion: Hermosa casa moderna...
- estrato: 3
- estado_inmueble: nuevo

**Tabla `ubicaciones`:**
```sql
SELECT * FROM ubicaciones WHERE id_inmueble = [el_id_del_inmueble];
```

Deberías ver:
- municipio: Medellín
- barrio_vereda: El Poblado
- direccion: Calle 10 #45-67

**Tabla `servicios_publicos`:**
```sql
SELECT * FROM servicios_publicos WHERE id_inmueble = [el_id_del_inmueble];
```

Deberías ver:
- acueducto: true
- energia: true
- alcantarillado: true
- gas: true
- internet: true

**Tabla `casas`:**
```sql
SELECT * FROM casas WHERE id_inmueble = [el_id_del_inmueble];
```

Deberías ver:
- metros_cuadrados: 150
- habitaciones: 3
- banos: 2
- pisos: 2
- patio: true
- jardin: true
- cocina: integral
- parqueadero: cubierto

---

## 🎨 Probar Otros Tipos de Propiedades

### Ejemplo 2: Publicar un Apartamento

**Información Básica:**
- Tipo: **Apartamento**
- Operación: **Arriendo**
- Precio: **1500000** (1.5 millones mensuales)
- Descripción: **Apartamento moderno con vista panorámica**

**Ubicación:**
- Municipio: **Bogotá**
- Barrio: **Chapinero**

**Características de Apartamento:**
- Área Total: **85** ⭐ (obligatorio)
- Pisos del Edificio: **15**
- Torre/Bloque: **2**
- Habitaciones: **2**
- Baños: **2**
- ✅ Balcón
- ✅ Ascensor
- ✅ Vigilancia 24h
- Valor Administración: **250000**
- Zona Social: **Piscina, gimnasio, salón social**
- Cocina: **integral**
- Parqueadero: **cubierto**

### Ejemplo 3: Publicar un Local

**Información Básica:**
- Tipo: **Local**
- Operación: **Arriendo**
- Precio: **3000000**
- Descripción: **Local comercial en zona de alto tráfico**

**Ubicación:**
- Municipio: **Cali**
- Barrio: **Centro**

**Características de Local:**
- Área Construida: **120** ⭐ (obligatorio)
- Zona del Local: **comercial**
- Tipo de Local: **comercio**
- Número de Baños: **2**
- ✅ Parqueadero
- ✅ Aire Acondicionado

---

## 🔍 Diferencias Admin vs Usuario

### Como Admin:
- ✅ **Publica directamente** en la tabla `inmuebles`
- ✅ **Aparece inmediatamente** en el sitio
- ✅ **No requiere aprobación**
- ✅ Endpoint: `/api/inmuebles-admin`
- ✅ Mensaje: "¡Propiedad publicada exitosamente!"

### Como Usuario Regular:
- ✅ Envía a tabla `propiedades_pendientes`
- ✅ Requiere aprobación del admin
- ✅ No aparece hasta ser aprobada
- ✅ Endpoint: `/api/inmuebles`
- ✅ Mensaje: "¡Propiedad enviada para revisión!"

---

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED"
**Problema:** El backend no está corriendo
**Solución:**
```bash
cd backend
npm run dev
```

### Error: "Valor, tipo de inmueble y tipo de operación son requeridos"
**Problema:** Faltan campos obligatorios
**Solución:** Completa:
- Precio
- Tipo de Inmueble
- Tipo de Operación
- Municipio

### Error: "La ubicación con municipio es requerida"
**Problema:** No ingresaste el municipio
**Solución:** Completa el campo "Municipio/Ciudad"

### Error: "No tienes permisos"
**Problema:** No estás logueado como admin
**Solución:** 
1. Cierra sesión
2. Inicia sesión con: admin@inmuebles.com / admin123

### La propiedad no aparece en el inicio
**Problema:** Puede ser que los filtros estén activos
**Solución:**
1. Haz clic en "Limpiar Filtros"
2. Refresca la página (F5)

### Error al insertar características
**Problema:** La tabla hija no existe o tiene campos diferentes
**Solución:** Verifica que la tabla exista en Supabase:
- `casas`
- `apartamentos`
- `locales`
- `bodegas`
- `fincas`
- `apartaestudios`
- `lotes`

---

## 📊 Estructura de Datos Enviados

Cuando publicas como admin, se envía esto al backend:

```json
{
  "valor": 250000000,
  "estrato": 3,
  "descripcion": "Hermosa casa moderna...",
  "numero_matricula": "MAT-1732145678-456",
  "tipo_operacion": "venta",
  "tipo_inmueble": "casa",
  "estado_inmueble": "nuevo",
  "zona": "urbano",
  "estado_conservacion": "bueno",
  "ubicacion": {
    "direccion": "Calle 10 #45-67",
    "barrio_vereda": "El Poblado",
    "municipio": "Medellín",
    "departamento": "Colombia",
    "tipo_via": "Calle"
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
    "area_fondo": 15,
    "anos_construccion": 5,
    "metros_cuadrados": 150,
    "pisos": 2,
    "habitaciones": 3,
    "banos": 2,
    "patio": true,
    "jardin": true,
    "sala_comedor": "sala-comedor",
    "cocina": "integral",
    "zona_lavado": "interna",
    "parqueadero": "cubierto"
  }
}
```

---

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Usuario admin creado
- [ ] Sesión iniciada como admin
- [ ] Formulario carga correctamente
- [ ] Campos cambian según tipo de propiedad
- [ ] Todos los campos obligatorios completos
- [ ] Formulario se envía sin errores
- [ ] Mensaje de éxito aparece
- [ ] Propiedad aparece en la página de inicio
- [ ] Datos guardados correctamente en BD

---

## 🎉 ¡Listo!

Ahora puedes publicar propiedades como administrador y aparecerán inmediatamente en el sitio sin necesidad de aprobación.

**Ventajas del sistema:**
- ✅ Formulario dinámico que se adapta a cada tipo
- ✅ Validaciones automáticas
- ✅ Guarda en múltiples tablas relacionadas
- ✅ Publicación instantánea para admin
- ✅ Sistema de aprobación para usuarios

¡Disfruta publicando propiedades! 🏠🚀
