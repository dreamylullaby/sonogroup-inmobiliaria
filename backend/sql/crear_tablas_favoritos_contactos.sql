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

-- Comentarios
COMMENT ON TABLE favoritos IS 'Tabla para almacenar las propiedades favoritas de los usuarios';
COMMENT ON TABLE contactos IS 'Tabla para almacenar las solicitudes de contacto sobre propiedades';
