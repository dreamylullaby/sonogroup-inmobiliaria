import { supabase } from './src/config/supabase.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const crearTablas = async () => {
    try {
        console.log('🔧 Creando tablas de favoritos y contactos...\n');

        // Crear tabla favoritos
        const { error: errorFavoritos } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS favoritos (
                    id_favorito SERIAL PRIMARY KEY,
                    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
                    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(id_usuario, id_inmueble)
                );
            `
        });

        if (errorFavoritos) {
            console.log('⚠️  Tabla favoritos:', errorFavoritos.message);
        } else {
            console.log('✅ Tabla favoritos creada/verificada');
        }

        // Crear tabla contactos
        const { error: errorContactos } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS contactos (
                    id_contacto SERIAL PRIMARY KEY,
                    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                    id_inmueble INTEGER NOT NULL REFERENCES inmuebles(id_inmueble) ON DELETE CASCADE,
                    mensaje TEXT NOT NULL,
                    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondido', 'cerrado')),
                    fecha_contacto TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `
        });

        if (errorContactos) {
            console.log('⚠️  Tabla contactos:', errorContactos.message);
        } else {
            console.log('✅ Tabla contactos creada/verificada');
        }

        console.log('\n📝 NOTA: Si las tablas no se crearon automáticamente,');
        console.log('ejecuta manualmente el SQL en Supabase SQL Editor:');
        console.log('backend/sql/crear_tablas_favoritos_contactos.sql\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n📝 Ejecuta manualmente el SQL en Supabase SQL Editor:');
        console.log('backend/sql/crear_tablas_favoritos_contactos.sql\n');
    }
};

crearTablas();
