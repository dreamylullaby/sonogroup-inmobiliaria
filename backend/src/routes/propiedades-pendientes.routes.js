import express from 'express';
import { supabase } from '../config/supabase.js';
import { verificarToken, verificarRol } from '../middleware/auth.js';

const router = express.Router();

// Crear solicitud de propiedad (usuarios)
router.post('/', verificarToken, async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            tipo,
            estado,
            precio,
            ubicacion,
            direccion,
            habitaciones,
            banos,
            area,
            imagen,
            caracteristicas
        } = req.body;

        if (!titulo || !precio || !ubicacion) {
            return res.status(400).json({
                error: 'Título, precio y ubicación son requeridos'
            });
        }

        const { data, error } = await supabase
            .from('propiedades_pendientes')
            .insert([{
                id_usuario: req.usuario.id_usuario,
                titulo,
                descripcion,
                tipo,
                estado,
                precio,
                ubicacion,
                direccion,
                habitaciones,
                banos,
                area,
                imagen,
                caracteristicas,
                estado_aprobacion: 'pendiente'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            mensaje: 'Propiedad enviada para revisión',
            propiedad: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener propiedades pendientes del usuario
router.get('/mis-propiedades', verificarToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('propiedades_pendientes')
            .select('*')
            .eq('id_usuario', req.usuario.id_usuario)
            .order('fecha_solicitud', { ascending: false });

        if (error) throw error;

        res.json({ propiedades: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todas las propiedades pendientes (solo admin)
router.get('/', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('propiedades_pendientes')
            .select(`
                *,
                usuarios (nombre, email, telefono)
            `)
            .order('fecha_solicitud', { ascending: false });

        if (error) {
            console.error('Error en propiedades-pendientes:', error);
            throw error;
        }

        res.json({ propiedades: data || [] });
    } catch (error) {
        console.error('Error al obtener propiedades pendientes:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.details || 'Sin detalles adicionales'
        });
    }
});

// Aprobar propiedad (solo admin)
router.put('/:id/aprobar', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const { id } = req.params;

        console.log('✅ Aprobando propiedad pendiente:', id);

        // Obtener la propiedad pendiente
        const { data: propiedadPendiente, error: errorGet } = await supabase
            .from('propiedades_pendientes')
            .select('*')
            .eq('id_propiedad_pendiente', id)
            .single();

        if (errorGet) throw errorGet;

        // Parsear características si están en JSON
        let caracteristicasObj = {};
        try {
            caracteristicasObj = typeof propiedadPendiente.caracteristicas === 'string' 
                ? JSON.parse(propiedadPendiente.caracteristicas) 
                : propiedadPendiente.caracteristicas || {};
        } catch (e) {
            console.error('Error al parsear características:', e);
        }

        // 1. Crear inmueble en tabla principal
        const { data: nuevoInmueble, error: errorInmueble } = await supabase
            .from('inmuebles')
            .insert([{
                id_usuario: propiedadPendiente.id_usuario,
                valor: propiedadPendiente.precio,
                estrato: caracteristicasObj.estrato || 3,
                descripcion: propiedadPendiente.descripcion,
                numero_matricula: `MAT-${Date.now()}`,
                tipo_operacion: caracteristicasObj.tipo_operacion || 'venta',
                tipo_inmueble: propiedadPendiente.tipo,
                estado_inmueble: propiedadPendiente.estado || 'usado',
                zona: caracteristicasObj.zona || 'urbano',
                estado_conservacion: caracteristicasObj.estado_conservacion || 'usado'
            }])
            .select()
            .single();

        if (errorInmueble) throw errorInmueble;

        console.log('✅ Inmueble creado:', nuevoInmueble.id_inmueble);

        // 2. Crear ubicación
        if (caracteristicasObj.ubicacion_completa) {
            await supabase
                .from('ubicaciones')
                .insert([{
                    id_inmueble: nuevoInmueble.id_inmueble,
                    ...caracteristicasObj.ubicacion_completa
                }]);
        }

        // 3. Crear servicios
        if (caracteristicasObj.servicios) {
            await supabase
                .from('servicios_publicos')
                .insert([{
                    id_inmueble: nuevoInmueble.id_inmueble,
                    ...caracteristicasObj.servicios
                }]);
        }

        // 4. Crear características específicas
        if (caracteristicasObj.caracteristicas_especificas) {
            const tabla = `${propiedadPendiente.tipo}s`;
            await supabase
                .from(tabla)
                .insert([{
                    id_inmueble: nuevoInmueble.id_inmueble,
                    ...caracteristicasObj.caracteristicas_especificas
                }]);
        }

        // 5. Actualizar estado de la propiedad pendiente
        await supabase
            .from('propiedades_pendientes')
            .update({ 
                estado_aprobacion: 'aprobado',
                fecha_revision: new Date().toISOString()
            })
            .eq('id_propiedad_pendiente', id);

        console.log('🎉 Propiedad aprobada y publicada exitosamente');

        res.json({
            mensaje: 'Propiedad aprobada y publicada',
            propiedad: nuevoInmueble
        });
    } catch (error) {
        console.error('❌ Error al aprobar propiedad:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rechazar propiedad (solo admin)
router.put('/:id/rechazar', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        const { data, error } = await supabase
            .from('propiedades_pendientes')
            .update({ 
                estado_aprobacion: 'rechazado',
                motivo_rechazo: motivo,
                fecha_revision: new Date().toISOString()
            })
            .eq('id_propiedad_pendiente', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            mensaje: 'Propiedad rechazada',
            propiedad: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar propiedad pendiente
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que sea el dueño o admin
        const { data: propiedad } = await supabase
            .from('propiedades_pendientes')
            .select('id_usuario')
            .eq('id_propiedad_pendiente', id)
            .single();

        if (propiedad.id_usuario !== req.usuario.id_usuario && req.usuario.rol !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos' });
        }

        const { error } = await supabase
            .from('propiedades_pendientes')
            .delete()
            .eq('id_propiedad_pendiente', id);

        if (error) throw error;

        res.json({ mensaje: 'Propiedad eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
