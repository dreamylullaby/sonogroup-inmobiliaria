import { supabase } from './src/config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const crearTabla = async () => {
    try {
        console.log('🔧 Creando tabla propiedades_pendientes...\n');

        // Nota: Supabase no permite ejecutar DDL directamente desde el cliente
        // Debes ejecutar el SQL manualmente en Supabase Dashboard

        console.log('⚠️  IMPORTANTE: Debes ejecutar este SQL en Supabase Dashboard:\n');
        console.log('1. Ve a: https://supabase.com/dashboard');
        console.log('2. Selecciona tu proyecto');
        console.log('3. Ve a "SQL Editor"');
        console.log('4. Copia y pega este SQL:\n');
        console.log('─'.repeat(80));
        console.log(`
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

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_propiedades_pendientes_usuario ON propiedades_pendientes(id_usuario);
CREATE INDEX IF NOT EXISTS idx_propiedades_pendientes_estado ON propiedades_pendientes(estado_aprobacion);

-- Comentario
COMMENT ON TABLE propiedades_pendientes IS 'Tabla para almacenar propiedades enviadas por usuarios que esperan aprobación del administrador';
        `);
        console.log('─'.repeat(80));
        console.log('\n5. Click en "Run" o presiona Ctrl+Enter');
        console.log('6. Verifica que se creó en "Table Editor"\n');

        // Verificar si la tabla existe
        const { data, error } = await supabase
            .from('propiedades_pendientes')
            .select('count')
            .limit(1);

        if (error) {
            if (error.message.includes('does not exist')) {
                console.log('❌ La tabla NO existe aún. Por favor ejecuta el SQL arriba.\n');
            } else {
                console.log('⚠️  Error al verificar:', error.message, '\n');
            }
        } else {
            console.log('✅ ¡La tabla ya existe! Todo listo para usar.\n');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

crearTabla();
