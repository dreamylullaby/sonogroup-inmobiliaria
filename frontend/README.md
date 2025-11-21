# Frontend - Sistema de Gestión de Inmuebles

Frontend desarrollado con React + Vite para la plataforma de búsqueda y gestión de propiedades inmobiliarias.

## 🚀 Características

- **Navbar Responsive**: Navegación adaptable con menú móvil
- **Footer Completo**: Información de contacto y enlaces rápidos
- **Búsqueda por Filtros**: Sistema avanzado de filtrado de propiedades
  - Tipo de propiedad (casa, apartamento, terreno, etc.)
  - Estado (venta/alquiler)
  - Rango de precios
  - Número de habitaciones y baños
  - Ubicación
- **Tarjetas de Propiedades**: Visualización atractiva con imágenes y detalles
- **Diseño Moderno**: UI limpia y profesional con animaciones suaves

## 📦 Instalación

```bash
cd frontend
npm install
```

## 🏃‍♂️ Ejecutar en Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

## 🏗️ Compilar para Producción

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   ├── Navbar.css
│   │   ├── Footer.jsx          # Pie de página
│   │   ├── Footer.css
│   │   ├── PropertyFilters.jsx # Filtros de búsqueda
│   │   ├── PropertyFilters.css
│   │   ├── PropertyCard.jsx    # Tarjeta de propiedad
│   │   └── PropertyCard.css
│   ├── pages/
│   │   ├── Home.jsx            # Página principal
│   │   └── Home.css
│   ├── App.jsx                 # Componente principal
│   ├── App.css
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── index.html
├── vite.config.js
└── package.json
```

## 🔌 Conexión con el Backend

El frontend está configurado para conectarse al backend en `http://localhost:3001`. 
Asegúrate de que el backend esté ejecutándose antes de usar la aplicación.

La configuración del proxy se encuentra en `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

## 🎨 Componentes Principales

### Navbar
- Logo y nombre de la aplicación
- Enlaces de navegación
- Botones de autenticación
- Menú hamburguesa para móviles

### PropertyFilters
- Filtro por tipo de propiedad
- Filtro por estado (venta/alquiler)
- Búsqueda por ubicación
- Rango de precios
- Número de habitaciones y baños
- Botón para limpiar filtros

### PropertyCard
- Imagen de la propiedad
- Badge de estado (venta/alquiler)
- Título y ubicación
- Precio formateado
- Características (habitaciones, baños, área)
- Descripción breve
- Botón para ver detalles

### Footer
- Información de la empresa
- Enlaces rápidos
- Datos de contacto
- Redes sociales

## 🛠️ Tecnologías

- **React 18**: Biblioteca de UI
- **Vite**: Build tool y dev server
- **React Router**: Navegación
- **Axios**: Cliente HTTP
- **CSS3**: Estilos con variables CSS

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Desktop (> 1024px)
