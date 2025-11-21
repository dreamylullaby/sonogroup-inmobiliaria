import express from 'express';
import { supabase } from '../config/supabase.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los inmuebles con filtros opcionales
router.get('/', async (req, res) => {
    try {
        const { 
            tipo_inmueble, 
            tipo_operacion, 
            zona, 
            municipio,
            precio_min,
            precio_max,
            limit = 50, 
            offset = 0 
        } = req.query;

        let query = supabase
            .from('inmuebles')
            .select(`
                *,
                usuarios (nombre, email, telefono),
                ubicaciones (*),
                servicios_publicos (*),
                fotografias (*)
            `)
            .range(offset, offset + limit - 1);

        // Aplicar filtros
        if (tipo_inmueble) query = query.eq('tipo_inmueble', tipo_inmueble);
        if (tipo_operacion) query = query.eq('tipo_operacion', tipo_operacion);
        if (zona) query = query.eq('zona', zona);
        if (precio_min) query = query.gte('valor', precio_min);
        if (precio_max) query = query.lte('valor', precio_max);

        const { data, error } = await query;

        if (error) throw error;

        // Obtener características específicas de cada inmueble
        const inmueblesConCaracteristicas = await Promise.all(
            (data || []).map(async (inmueble) => {
                try {
                    const tabla = `${inmueble.tipo_inmueble}s`;
                    const { data: caracteristicas } = await supabase
                        .from(tabla)
                        .select('*')
                        .eq('id_inmueble', inmueble.id_inmueble)
                        .single();

                    return {
                        ...inmueble,
                        caracteristicas
                    };
                } catch (err) {
                    return inmueble;
                }
            })
        );

        // Filtrar por municipio si se especifica (filtro en ubicaciones)
        let resultados = inmueblesConCaracteristicas;
        if (municipio) {
            resultados = resultados.filter(inmueble => 
                inmueble.ubicaciones?.municipio?.toLowerCase().includes(municipio.toLowerCase())
            );
        }

        res.json({
            total: resultados.length,
            inmuebles: resultados
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un inmueble por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('inmuebles')
            .select(`
        *,
        usuarios (nombre, email, telefono),
        ubicaciones (*),
        servicios_publicos (*),
        fotografias (*)
      `)
            .eq('id_inmueble', id)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ error: 'Inmueble no encontrado' });
        }

        // Obtener características específicas según el tipo
        let caracteristicas = null;
        const tabla = `${data.tipo_inmueble}s`;

        const { data: caract } = await supabase
            .from(tabla)
            .select('*')
            .eq('id_inmueble', id)
            .single();

        caracteristicas = caract;

        res.json({
            ...data,
            caracteristicas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo inmueble (requiere autenticación)
router.post('/', verificarToken, async (req, res) => {
    try {
        const {
            valor,
            estrato,
            descripcion,
            numero_matricula,
            tipo_operacion,
            tipo_inmueble,
            estado_inmueble,
            zona,
            estado_conservacion,
            ubicacion,
            servicios,
            caracteristicas
        } = req.body;

        // Insertar inmueble
        const { data: inmueble, error: errorInmueble } = await supabase
            .from('inmuebles')
            .insert([{
                id_usuario: req.usuario.id_usuario,
                valor,
                estrato,
                descripcion,
                numero_matricula,
                tipo_operacion,
                tipo_inmueble,
                estado_inmueble,
                zona,
                estado_conservacion
            }])
            .select()
            .single();

        if (errorInmueble) throw errorInmueble;

        // Insertar ubicación
        if (ubicacion) {
            await supabase
                .from('ubicaciones')
                .insert([{ id_inmueble: inmueble.id_inmueble, ...ubicacion }]);
        }

        // Insertar servicios públicos
        if (servicios) {
            await supabase
                .from('servicios_publicos')
                .insert([{ id_inmueble: inmueble.id_inmueble, ...servicios }]);
        }

        // Insertar características específicas
        if (caracteristicas) {
            const tabla = `${tipo_inmueble}s`;
            await supabase
                .from(tabla)
                .insert([{ id_inmueble: inmueble.id_inmueble, ...caracteristicas }]);
        }

        res.status(201).json({
            mensaje: 'Inmueble creado exitosamente',
            inmueble
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un inmueble (requiere autenticación)
router.put('/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Verificar que el usuario sea el propietario o admin
        const { data: inmueble } = await supabase
            .from('inmuebles')
            .select('id_usuario')
            .eq('id_inmueble', id)
            .single();

        if (!inmueble) {
            return res.status(404).json({ error: 'Inmueble no encontrado' });
        }

        if (inmueble.id_usuario !== req.usuario.id_usuario && req.usuario.rol !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para modificar este inmueble' });
        }

        const { data, error } = await supabase
            .from('inmuebles')
            .update(updates)
            .eq('id_inmueble', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            mensaje: 'Inmueble actualizado exitosamente',
            inmueble: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un inmueble (requiere autenticación)
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el usuario sea el propietario o admin
        const { data: inmueble } = await supabase
            .from('inmuebles')
            .select('id_usuario')
            .eq('id_inmueble', id)
            .single();

        if (!inmueble) {
            return res.status(404).json({ error: 'Inmueble no encontrado' });
        }

        if (inmueble.id_usuario !== req.usuario.id_usuario && req.usuario.rol !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este inmueble' });
        }

        const { error } = await supabase
            .from('inmuebles')
            .delete()
            .eq('id_inmueble', id);

        if (error) throw error;

        res.json({ mensaje: 'Inmueble eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
