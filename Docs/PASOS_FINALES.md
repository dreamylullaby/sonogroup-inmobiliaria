# 🚀 Pasos Finales para Completar el Sistema

## ⚠️ IMPORTANTE: Crear Tablas en Supabase

Las tablas de `favoritos` y `contactos` deben crearse manualmente en Supabase.

### Pasos:

1. **Abre Supabase Dashboard**
   - Ve a: https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Abre SQL Editor**
   - En el menú lateral, click en "SQL Editor"
   - Click en "New query"

3. **Copia y pega este SQL:**

```sql
-- Tabla de Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_usuario, id_inmueble)
);

-- Tabla de Contactos/Solicitudes
CREATE TABLE IF NOT EXISTS contactos (
    id_contacto SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondido', 'cerrado')),
    fecha_contacto TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(id_usuario);
CREATE INDEX IF NOT EXISTS idx_favoritos_inmueble ON favoritos(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_contactos_usuario ON contactos(id_usuario);
CREATE INDEX IF NOT EXISTS idx_contactos_inmueble ON contactos(id_inmueble);
CREATE INDEX IF NOT EXISTS idx_contactos_estado ON contactos(estado);
```

4. **Ejecuta el SQL**
   - Click en "Run" o presiona Ctrl+Enter

5. **Verifica que se crearon**
   - Ve a "Table Editor" en el menú lateral
   - Deberías ver las tablas `favoritos` y `contactos`

---

## ✅ Verificar que todo funciona

### 1. Backend corriendo:
```bash
cd backend
npm run dev
```
Debe estar en: `http://localhost:3000`

### 2. Frontend corriendo:
```bash
cd frontend
npm run dev
```
Debe estar en: `http://localhost:5174`

---

## 🧪 Probar el Sistema

### Como Visitante:
1. Abre: `http://localhost:5174`
2. Navega por las propiedades
3. Click en "Ver Detalles" de cualquier propiedad
4. Intenta guardar en favoritos → Te redirige a login ✅

### Registrar Usuario:
1. Click en "Registrarse" en el navbar
2. Completa el formulario:
   - Nombre: Tu Nombre
   - Email: test@test.com
   - Password: 123456
   - Confirmar: 123456
3. Click en "Registrarse"
4. Serás redirigido a la página principal logueado ✅

### Como Usuario Logueado:
1. Ve a cualquier propiedad
2. Click en "🤍 Guardar" → Se guarda en favoritos ✅
3. El botón cambia a "❤️ Guardado" ✅
4. Click en "❤️ Favoritos" en el navbar
5. Verás la propiedad guardada ✅
6. Click en "📧 Contactar" en una propiedad
7. Escribe un mensaje y envía ✅

### Como Admin:
1. Cierra sesión
2. Inicia sesión con:
   - Email: admin@inmuebles.com
   - Password: admin123
3. Verás "Panel Admin" en el navbar ✅
4. Click en "Panel Admin"
5. Verás estadísticas y usuarios ✅

---

## 📊 Resumen de Funcionalidades

| Funcionalidad | Visitante | Usuario | Admin |
|---------------|-----------|---------|-------|
| Ver propiedades | ✅ | ✅ | ✅ |
| Filtrar propiedades | ✅ | ✅ | ✅ |
| Ver detalles | ✅ | ✅ | ✅ |
| Guardar favoritos | ❌ | ✅ | ✅ |
| Contactar | ❌ | ✅ | ✅ |
| Registrarse | ✅ | - | - |
| Panel Admin | ❌ | ❌ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |

---

## 🎯 URLs del Sistema

- **Home:** http://localhost:5174/
- **Login:** http://localhost:5174/login
- **Registro:** http://localhost:5174/registro
- **Favoritos:** http://localhost:5174/favoritos (requiere login)
- **Detalle Propiedad:** http://localhost:5174/propiedad/1
- **Panel Admin:** http://localhost:5174/admin (solo admin)

---

## 📝 Credenciales de Prueba

### Usuario Admin:
```
Email: admin@inmuebles.com
Password: admin123
```

### Usuario Normal (crear con registro):
```
Email: test@test.com
Password: 123456
```

---

## ❓ Solución de Problemas

### Error: "Could not find table favoritos"
→ Ejecuta el SQL en Supabase (ver arriba)

### Error: "Network Error"
→ Verifica que el backend esté corriendo en puerto 3000

### No aparecen propiedades
→ El frontend usa datos de ejemplo si no hay conexión al backend

### No puedo guardar favoritos
→ Verifica que las tablas estén creadas en Supabase

---

## 🎉 ¡Listo!

Una vez ejecutado el SQL en Supabase, todo el sistema estará completamente funcional:

✅ Registro de usuarios
✅ Login/Logout
✅ Ver propiedades (visitantes y usuarios)
✅ Detalles de propiedades
✅ Guardar favoritos (solo usuarios)
✅ Contactar sobre propiedades (solo usuarios)
✅ Panel de administración (solo admin)
✅ Gestión de usuarios (solo admin)

---

**Siguiente paso:** Ejecuta el SQL en Supabase y prueba el sistema! 🚀
