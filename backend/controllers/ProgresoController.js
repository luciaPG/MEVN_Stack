const Progreso = require("../models/Progreso");
const Episodio = require("../models/Episodio");
const User = require("../models/UserModel");

// CREATE
const createProgreso = async (req, res) => {
    try {
        const usuario = req.user._id;
        if (!usuario) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
        const episodioExistente = await Episodio.findById(req.body.episodio);
        if (!episodioExistente) {
            return res.status(404).json({ message: "Episodio no encontrado" });
        }

        const progresoExistente = await Progreso.findOne({
            usuario: usuario,
            episodio: req.body.episodio,
        });
        if (progresoExistente) {
            return res.status(400).json({ message: "El progreso ya existe" });
        }

        const nuevoProgreso = new Progreso(req.body);
        await nuevoProgreso.save();
        res.status(201).json(nuevoProgreso);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el progreso" });
    }
};

// READ BY USER ID
const getProgresoByUserId = async (req, res) => {
    try {
        const progreso = await Progreso.find({ usuario: req.params.id })
            .populate("episodio")
            .populate("usuario");
        if (!progreso) {
            return res.status(404).json({ message: "Progreso no encontrado" });
        }
        res.status(200).json(progreso);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el progreso" });
    }
};

// READ BY EPISODIO ID
const getProgresoByEpisodioId = async (req, res) => {
    try {
        const progreso = await Progreso.find({ episodio: req.params.id })
            .populate("episodio")
            .populate("usuario");
        if (!progreso) {
            return res.status(404).json({ message: "Progreso no encontrado" });
        }
        res.status(200).json(progreso);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el progreso" });
    }
};

// UPDATE 
const updateProgreso = async (req, res) => {
    try {
        const updatedProgreso = await Progreso.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProgreso) {
            return res.status(404).json({ message: "Progreso no encontrado" });
        }
        res.status(200).json(updatedProgreso);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el progreso" });
    }
};

// DELETE
const deleteProgreso = async (req, res) => {
    try {
        const deletedProgreso = await Progreso.findByIdAndDelete(req.params.id);
        if (!deletedProgreso) {
            return res.status(404).json({ message: "Progreso no encontrado" });
        }
        res.status(200).json({ message: "Progreso eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el progreso" });
    }
};

module.exports = {
    createProgreso,
    getProgresoByUserId,
    getProgresoByEpisodioId,
    updateProgreso,
    deleteProgreso,
};