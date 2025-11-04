const Usuario = require('../models/usuario');

const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password)
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });

        const existente = await Usuario.findOne({ where: { email } });

        if (existente) 
            return res.status(400).json({ error: 'El correo ya está registrado' });

        const usuario = await Usuario.create({ nombre, email, password });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        
        const { nombre, email, password } = req.body;

        if (!nombre && !email && !password)
            return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });

        await usuario.update({ nombre, email, password });
        res.json({ message: 'Usuario actualizado correctamente', usuario });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) 
            return res.status(404).json({ error: 'Usuario no encontrado' });
        await usuario.destroy();
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario };
