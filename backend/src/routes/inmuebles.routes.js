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
        
        console.log(`🔍 Buscando características en tabla: ${tabla} para inmueble ${id}`);

        const { data: caract, error: errorCaract } = await supabase
            .from(tabla)
            .select('*')
            .eq('id_inmueble', id)
            .single();

        if (errorCaract) {
            console.error(`⚠️ Error al obtener características de ${tabla}:`, errorCaract.message);
        } else {
            console.log(`✅ Características encontradas:`, caract);
        }

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
// Los usuarios normales crean propiedades pendientes, los admin publican directamente
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

        // Si es admin, redirigir al endpoint de admin
        if (req.usuario.rol === 'admin') {
            return res.status(400).json({
                error: 'Los administradores deben usar el endpoint /api/inmuebles-admin'
            });
        }

        // Usuarios normales: crear propiedad pendiente
        console.log('📝 Usuario normal creando propiedad pendiente...');

        // Preparar datos para propiedades_pendientes
        const datosPropiedad = {
            id_usuario: req.usuario.id_usuario,
            titulo: descripcion?.substring(0, 100) || `${tipo_inmueble} en ${ubicacion?.municipio || 'ubicación'}`,
            descripcion: descripcion || '',
            tipo: tipo_inmueble,
            estado: estado_inmueble,
            precio: parseFloat(valor),
            ubicacion: ubicacion?.municipio || '',
            direccion: ubicacion?.direccion || '',
            habitaciones: caracteristicas?.habitaciones || null,
            banos: caracteristicas?.banos || null,
            area: caracteristicas?.metros_cuadrados || caracteristicas?.area_total || caracteristicas?.area_construida || null,
            imagen: null,
            caracteristicas: JSON.stringify({
                tipo_operacion,
                zona,
                estrato,
                estado_conservacion,
                ubicacion_completa: ubicacion,
                servicios,
                caracteristicas_especificas: caracteristicas
            }),
            estado_aprobacion: 'pendiente'
        };

        const { data: propiedadPendiente, error: errorInsert } = await supabase
            .from('propiedades_pendientes')
            .insert([datosPropiedad])
            .select()
            .single();

        if (errorInsert) {
            console.error('❌ Error al crear propiedad pendiente:', errorInsert);
            throw errorInsert;
        }

        console.log('✅ Propiedad pendiente creada:', propiedadPendiente.id_propiedad_pendiente);

        res.status(201).json({
            mensaje: 'Propiedad enviada para revisión del administrador',
            propiedad: propiedadPendiente
        });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un inmueble completo (requiere autenticación)
router.put('/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
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

        console.log('📝 Actualizando inmueble:', id);
        console.log('📦 Datos recibidos:', { valor, estrato, tipo_inmueble, tipo_operacion });

        // Verificar que el usuario sea el propietario o admin
        const { data: inmuebleExistente, error: errorBusqueda } = await supabase
            .from('inmuebles')
            .select('id_usuario, tipo_inmueble')
            .eq('id_inmueble', id)
            .single();

        if (errorBusqueda || !inmuebleExistente) {
            console.error('❌ Inmueble no encontrado:', errorBusqueda);
            return res.status(404).json({ error: 'Inmueble no encontrado' });
        }

        if (inmuebleExistente.id_usuario !== req.usuario.id_usuario && req.usuario.rol !== 'admin') {
            return res.status(403).json({ error: 'No tienes permisos para modificar este inmueble' });
        }

        // 1. Actualizar tabla inmuebles (solo campos que existen en la tabla)
        const datosInmueble = {};
        if (valor !== undefined) datosInmueble.valor = parseFloat(valor);
        if (estrato !== undefined) datosInmueble.estrato = parseInt(estrato);
        if (descripcion !== undefined) datosInmueble.descripcion = descripcion;
        if (numero_matricula !== undefined) datosInmueble.numero_matricula = numero_matricula;
        if (tipo_operacion !== undefined) datosInmueble.tipo_operacion = tipo_operacion;
        if (tipo_inmueble !== undefined) datosInmueble.tipo_inmueble = tipo_inmueble;
        if (estado_inmueble !== undefined) datosInmueble.estado_inmueble = estado_inmueble;
        if (zona !== undefined) datosInmueble.zona = zona;
        if (estado_conservacion !== undefined) datosInmueble.estado_conservacion = estado_conservacion;

        console.log('🔄 Actualizando tabla inmuebles con:', datosInmueble);

        const { data: inmuebleActualizado, error: errorInmueble } = await supabase
            .from('inmuebles')
            .update(datosInmueble)
            .eq('id_inmueble', id)
            .select()
            .single();

        if (errorInmueble) {
            console.error('❌ Error al actualizar inmueble:', errorInmueble);
            throw errorInmueble;
        }

        console.log('✅ Inmueble actualizado');

        // 2. Actualizar ubicación
        if (ubicacion && Object.keys(ubicacion).length > 0) {
            console.log('📍 Actualizando ubicación...');
            const { error: errorUbicacion } = await supabase
                .from('ubicaciones')
                .update(ubicacion)
                .eq('id_inmueble', id);
            
            if (errorUbicacion) {
                console.error('⚠️ Error al actualizar ubicación:', errorUbicacion.message);
            } else {
                console.log('✅ Ubicación actualizada');
            }
        }

        // 3. Actualizar servicios públicos
        if (servicios && Object.keys(servicios).length > 0) {
            console.log('🔌 Actualizando servicios...');
            const { error: errorServicios } = await supabase
                .from('servicios_publicos')
                .update(servicios)
                .eq('id_inmueble', id);
            
            if (errorServicios) {
                console.error('⚠️ Error al actualizar servicios:', errorServicios.message);
            } else {
                console.log('✅ Servicios actualizados');
            }
        }

        // 4. Actualizar características específicas
        if (caracteristicas && Object.keys(caracteristicas).length > 0) {
            console.log('🏠 Actualizando características...');
            
            // Si cambió el tipo de inmueble, eliminar de la tabla anterior
            if (inmuebleExistente.tipo_inmueble !== tipo_inmueble) {
                const tablaAnterior = `${inmuebleExistente.tipo_inmueble}s`;
                console.log(`🗑️ Eliminando de tabla anterior: ${tablaAnterior}`);
                await supabase
                    .from(tablaAnterior)
                    .delete()
                    .eq('id_inmueble', id);
            }

            const tablaHija = `${tipo_inmueble}s`;
            console.log(`📋 Actualizando tabla: ${tablaHija}`);
            
            // Verificar si existe un registro
            const { data: existeCaract } = await supabase
                .from(tablaHija)
                .select('*')
                .eq('id_inmueble', id)
                .single();

            if (existeCaract) {
                // Actualizar
                console.log('🔄 Registro existe, actualizando...');
                const { error: errorUpdate } = await supabase
                    .from(tablaHija)
                    .update(caracteristicas)
                    .eq('id_inmueble', id);

                if (errorUpdate) {
                    console.error(`⚠️ Error al actualizar ${tablaHija}:`, errorUpdate.message);
                } else {
                    console.log('✅ Características actualizadas');
                }
            } else {
                // Insertar
                console.log('➕ Registro no existe, insertando...');
                const { error: errorInsert } = await supabase
                    .from(tablaHija)
                    .insert([{ id_inmueble: parseInt(id), ...caracteristicas }]);

                if (errorInsert) {
                    console.error(`⚠️ Error al insertar en ${tablaHija}:`, errorInsert.message);
                } else {
                    console.log('✅ Características insertadas');
                }
            }
        }

        console.log('🎉 Actualización completa exitosa');

        res.json({
            mensaje: 'Inmueble actualizado exitosamente',
            inmueble: inmuebleActualizado
        });
    } catch (error) {
        console.error('❌ Error al actualizar inmueble:', error);
        res.status(500).json({ 
            error: error.message,
            detalles: error.details || 'Error al actualizar la propiedad'
        });
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
