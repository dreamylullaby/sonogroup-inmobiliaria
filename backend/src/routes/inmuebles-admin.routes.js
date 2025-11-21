import express from 'express';
import { supabase } from '../config/supabase.js';
import { verificarToken, verificarRol } from '../middleware/auth.js';

const router = express.Router();

// Crear inmueble directamente (solo admin) - Formulario Dinámico
router.post('/', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
        
        const {
            valor,
            estrato,
            descripcion,
            numero_matricula,
            tipo_operacion,
            tipo_inmueble,
            estado_inmueble,
            estado_conservacion,
            zona,
            ubicacion,
            servicios,
            caracteristicas
        } = req.body;

        // Validaciones
        if (!valor || !tipo_inmueble || !tipo_operacion) {
            console.log('❌ Validación fallida: campos básicos faltantes');
            return res.status(400).json({
                error: 'Valor, tipo de inmueble y tipo de operación son requeridos'
            });
        }

        if (!ubicacion || !ubicacion.municipio) {
            console.log('❌ Validación fallida: ubicación faltante');
            return res.status(400).json({
                error: 'La ubicación con municipio es requerida'
            });
        }
        
        console.log('✅ Validaciones pasadas');

        // Generar número de matrícula si no viene
        const matricula = numero_matricula || `MAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const datosInmueble = {
            id_usuario: req.usuario.id_usuario,
            valor: parseFloat(valor),
            estrato: parseInt(estrato) || 3,
            descripcion: descripcion || '',
            numero_matricula: matricula,
            tipo_operacion,
            tipo_inmueble,
            estado_inmueble: estado_inmueble || 'usado', // ENUM: nuevo, usado, remodelado
            zona: zona || 'urbano',
            estado_conservacion: estado_conservacion || 'nuevo' // ENUM: nuevo, usado, remodelado (OBLIGATORIO)
        };
        
        console.log('📝 Insertando en tabla inmuebles:', datosInmueble);

        // 1. Insertar en tabla inmuebles (padre)
        const { data: inmueble, error: errorInmueble } = await supabase
            .from('inmuebles')
            .insert([datosInmueble])
            .select()
            .single();

        if (errorInmueble) {
            console.error('❌ Error al insertar inmueble:', errorInmueble);
            throw errorInmueble;
        }
        
        console.log('✅ Inmueble insertado:', inmueble.id_inmueble);

        // 2. Insertar ubicación
        if (ubicacion) {
            console.log('📍 Insertando ubicación...');
            const { error: errorUbicacion } = await supabase
                .from('ubicaciones')
                .insert([{
                    id_inmueble: inmueble.id_inmueble,
                    direccion: ubicacion.direccion || '',
                    barrio_vereda: ubicacion.barrio_vereda || '',
                    municipio: ubicacion.municipio,
                    departamento: ubicacion.departamento || 'Colombia',
                    tipo_via: ubicacion.tipo_via || 'Calle'
                }]);
            
            if (errorUbicacion) {
                console.error('⚠️  Error al insertar ubicación:', errorUbicacion.message);
            } else {
                console.log('✅ Ubicación insertada');
            }
        }

        // 3. Insertar servicios públicos
        if (servicios) {
            console.log('🔌 Insertando servicios públicos...');
            const { error: errorServicios } = await supabase
                .from('servicios_publicos')
                .insert([{
                    id_inmueble: inmueble.id_inmueble,
                    acueducto: servicios.acueducto || false,
                    energia: servicios.energia || false,
                    alcantarillado: servicios.alcantarillado || false,
                    gas: servicios.gas || false,
                    internet: servicios.internet || false
                }]);
            
            if (errorServicios) {
                console.error('⚠️  Error al insertar servicios:', errorServicios.message);
            } else {
                console.log('✅ Servicios insertados');
            }
        }

        // 4. Insertar características específicas en tabla hija
        if (caracteristicas && Object.keys(caracteristicas).length > 0) {
            const tablaHija = `${tipo_inmueble}s`; // 'casas', 'apartamentos', etc.
            console.log(`🏠 Insertando características en tabla ${tablaHija}...`);
            
            try {
                const { error: errorCaract } = await supabase
                    .from(tablaHija)
                    .insert([{
                        id_inmueble: inmueble.id_inmueble,
                        ...caracteristicas
                    }]);
                
                if (errorCaract) {
                    console.error(`⚠️  Error al insertar en ${tablaHija}:`, errorCaract.message);
                } else {
                    console.log(`✅ Características insertadas en ${tablaHija}`);
                }
            } catch (err) {
                console.error(`❌ Excepción al insertar en ${tablaHija}:`, err.message);
            }
        }

        console.log('🎉 Propiedad publicada exitosamente');
        
        res.status(201).json({
            mensaje: 'Propiedad publicada exitosamente',
            inmueble: inmueble
        });
    } catch (error) {
        console.error('❌ Error al crear inmueble:', error);
        console.error('❌ Detalles del error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        
        res.status(500).json({ 
            error: error.message || 'Error desconocido',
            detalles: error.details || 'Error al publicar la propiedad',
            codigo: error.code
        });
    }
});

export default router;
