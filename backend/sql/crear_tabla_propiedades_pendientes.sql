-- Tabla de Propiedades Pendientes de Aprobación
CREATE TABLE IF NOT EXISTS propiedades_pendientes (
    id_propiedad_pendiente SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50),
    estado VARCHAR(20) CHECK (estado IN ('venta', 'alquiler')),
    precio DECIMAL(12, 2) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    habitaciones INTEGER,
    banos INTEGER,
    area DECIMAL(10, 2),
    imagen TEXT,
    estado_aprobacion VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_aprobacion IN ('pendiente', 'aprobado', 'rechazado')),
    motivo_rechazo TEXT,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_revision TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_propiedades_pendientes_usuario ON propiedades_pendientes(id_usuario);
CREATE INDEX IF NOT EXISTS idx_propiedades_pendientes_estado ON propiedades_pendientes(estado_aprobacion);

-- Comentario
COMMENT ON TABLE propiedades_pendientes IS 'Tabla para almacenar propiedades enviadas por usuarios que esperan aprobación del administrador';
