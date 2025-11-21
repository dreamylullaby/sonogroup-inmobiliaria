# 🚀 Cómo Probar el Formulario Dinámico

## ✅ Cambios Realizados

1. ✅ **App.jsx** - Actualizado para usar `PublishPropertyDynamic`
2. ✅ **PublishPropertyDynamic.jsx** - Formulario dinámico completo creado
3. ✅ **inmuebles-admin.routes.js** - Ruta backend actualizada para manejar datos complejos

## 🎯 Cómo Verlo en el Frontend

### Paso 1: Asegúrate de que el backend esté corriendo

```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
```

### Paso 2: Asegúrate de que el frontend esté corriendo

```bash
cd frontend
npm run dev
```

Deberías ver:
```
Local: http://localhost:5173/
```

### Paso 3: Accede al formulario

1. Abre tu navegador en `http://localhost:5173`
2. Inicia sesión como **admin** o **usuario**
3. Haz clic en **"Publicar"** en el navbar

## 🎨 Qué Verás

### Formulario con 4 Secciones:

#### 1️⃣ Información Básica
- **Tipo de Inmueble** (select) ← Al cambiar esto, cambian los campos específicos
- Tipo de Operación (Venta/Arriendo)
- Precio
- Descripción
- Estado del Inmueble
- Estrato

#### 2️⃣ Ubicación
- Municipio/Ciudad *
- Barrio/Vereda
- Dirección Completa

#### 3️⃣ Servicios Públicos
- Checkboxes: Acueducto, Energía, Alcantarillado, Gas, Internet

#### 4️⃣ Características Específicas (DINÁMICAS)
**Esta sección cambia según el tipo seleccionado**

## 🧪 Prueba Dinámica

### Prueba 1: Selecciona "Casa"
Verás campos como:
- ✅ Área Frente
- ✅ Área Fondo
- ✅ Metros Cuadrados *
- ✅ Número de Pisos
- ✅ Habitaciones
- ✅ Baños
- ✅ Patio (checkbox)
- ✅ Jardín (checkbox)
- ✅ Sala/Comedor (select)
- ✅ Cocina (select)
- ✅ Parqueadero (select)

### Prueba 2: Cambia a "Apartamento"
Los campos cambiarán a:
- ✅ Área Total *
- ✅ Pisos del Edificio
- ✅ Torre/Bloque
- ✅ Habitaciones
- ✅ Baños
- ✅ Balcón (checkbox)
- ✅ Ascensor (checkbox)
- ✅ Vigilancia 24h (checkbox)
- ✅ Valor Administración
- ✅ Zona Social

### Prueba 3: Cambia a "Local"
Los campos cambiarán a:
- ✅ Área Construida *
- ✅ Zona del Local (select)
- ✅ Tipo de Local (select)
- ✅ Número de Baños
- ✅ Parqueadero (checkbox)
- ✅ Aire Acondicionado (checkbox)

### Prueba 4: Cambia a "Bodega"
Los campos cambiarán a:
- ✅ Área Construida *
- ✅ Altura Libre
- ✅ Tipo Puerta de Carga (select)
- ✅ Capacidad de Carga
- ✅ Oficinas (checkbox)
- ✅ Baños (checkbox)
- ✅ Vestier (checkbox)

## 📝 Completar el Formulario (Ejemplo)

### Como Admin - Publicar una Casa:

1. **Tipo de Inmueble:** Casa
2. **Tipo de Operación:** Venta
3. **Precio:** 250000000
4. **Descripción:** Hermosa casa de dos pisos con jardín
5. **Estado:** Nuevo
6. **Estrato:** 3

**Ubicación:**
- Municipio: Medellín
- Barrio: El Poblado
- Dirección: Calle 10 #45-67

**Servicios:**
- ✅ Acueducto
- ✅ Energía
- ✅ Alcantarillado
- ✅ Gas
- ✅ Internet

**Características de Casa:**
- Área Frente: 8.5
- Área Fondo: 15
- Metros Cuadrados: 150
- Pisos: 2
- Habitaciones: 3
- Baños: 2
- ✅ Patio
- ✅ Jardín
- Sala/Comedor: sala-comedor
- Cocina: integral
- Parqueadero: cubierto

3. Click en **"Publicar Propiedad"**
4. Deberías ver: "¡Propiedad publicada exitosamente!"

## 🔍 Verificar en la Base de Datos

Después de publicar, verifica en Supabase:

### Tabla `inmuebles`
```sql
SELECT * FROM inmuebles ORDER BY fecha_registro DESC LIMIT 1;
```

Deberías ver el registro con todos los datos comunes.

### Tabla `ubicaciones`
```sql
SELECT * FROM ubicaciones WHERE id_inmueble = [el_id_del_inmueble];
```

Deberías ver la dirección, municipio, etc.

### Tabla `servicios_publicos`
```sql
SELECT * FROM servicios_publicos WHERE id_inmueble = [el_id_del_inmueble];
```

Deberías ver los servicios marcados.

### Tabla `casas` (o la tabla específica)
```sql
SELECT * FROM casas WHERE id_inmueble = [el_id_del_inmueble];
```

Deberías ver las características específicas (pisos, habitaciones, patio, etc.)

## 🎯 Diferencias Admin vs Usuario

### Como Admin:
- ✅ Publica **directamente**
- ✅ Aparece **inmediatamente** en el sitio
- ✅ Mensaje: "¡Propiedad publicada exitosamente!"
- ✅ Endpoint: `/api/inmuebles-admin`

### Como Usuario:
- ✅ Envía para **revisión**
- ✅ Aparece en **propiedades pendientes**
- ✅ Mensaje: "¡Propiedad enviada para revisión!"
- ✅ Endpoint: `/api/inmuebles`

## 🐛 Solución de Problemas

### Error: "Cannot read properties of undefined"
- Verifica que el backend esté corriendo
- Verifica que estés autenticado

### Error: "Valor, tipo de inmueble y tipo de operación son requeridos"
- Completa los campos obligatorios marcados con *

### Los campos no cambian al seleccionar tipo
- Refresca la página (F5)
- Verifica la consola del navegador (F12)

### Error al guardar
- Abre la consola del navegador (F12)
- Ve a la pestaña "Network"
- Busca la petición POST
- Revisa el error específico

## 📊 Estructura de Datos Enviados

El formulario envía esto al backend:

```json
{
  "valor": 250000000,
  "estrato": 3,
  "descripcion": "Hermosa casa...",
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
    "metros_cuadrados": 150,
    "pisos": 2,
    "habitaciones": 3,
    "banos": 2,
    "patio": true,
    "jardin": true,
    "sala_comedor": "sala-comedor",
    "cocina": "integral",
    "parqueadero": "cubierto"
  }
}
```

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Usuario autenticado (admin o usuario)
- [ ] Formulario carga correctamente
- [ ] Campos cambian al seleccionar tipo
- [ ] Validaciones funcionan
- [ ] Se puede enviar el formulario
- [ ] Mensaje de éxito aparece
- [ ] Datos se guardan en la base de datos

## 🎉 ¡Listo!

Ahora tienes un formulario dinámico profesional que:
- ✅ Se adapta a cada tipo de propiedad
- ✅ Guarda en múltiples tablas correctamente
- ✅ Ofrece excelente experiencia de usuario
- ✅ Es fácil de mantener y extender

¡Disfruta tu nuevo formulario! 🚀
