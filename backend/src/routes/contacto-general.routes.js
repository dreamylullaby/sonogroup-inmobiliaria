import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Crear mensaje de contacto (público)
router.post('/', async (req, res) => {
    try {
        const { nombre, email, telefono, asunto, mensaje } = req.body;

        if (!nombre || !email || !mensaje) {
            return res.status(400).json({
                error: 'Nombre, email y mensaje son requeridos'
            });
        }

        const { data, error } = await supabase
            .from('contactos_general')
            .insert([{
                nombre,
                email,
                telefono,
                asunto,
                mensaje,
                estado: 'pendiente'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            mensaje: 'Mensaje enviado exitosamente',
            contacto: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los mensajes (solo admin)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('contactos_general')
            .select('*')
            .order('fecha_contacto', { ascending: false });

        if (error) throw error;

        res.json({ contactos: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
