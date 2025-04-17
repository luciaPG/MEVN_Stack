const Episodio = require('../models/Episodio');
const Temporada = require('../models/Temporada');

// CREATE
const createEpisodio = async (req, res) => {
    try {
        const temporadaExistente = await Temporada.findById(req.body.temporada);
        if (!temporadaExistente) {
            return res.status(404).json({ message: "Temporada no encontrada" });
        }
        const nuevoEpisodio = new Episodio(req.body);
        await nuevoEpisodio.save();

        temporadaExistente.episodios.push(nuevoEpisodio._id);
        await temporadaExistente.save();
        res.status(201).json(nuevoEpisodio);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el episodio" });
    }
};

// READ ALL todas los episodios de la base de datos
const getAllEpisodios = async (req, res) => {
    try {
        const episodios = await Episodio.find().populate('temporada');
        res.status(200).json(episodios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener episodios" });
    }
};

// READ BY ID
const getEpisodioById = async (req, res) => {
    try {
        const episodio = await Episodio.findById(req.params.id).populate('temporada');
        if (!episodio) {
            return res.status(404).json({ message: "Episodio no encontrado" });
        }
        res.status(200).json(episodio);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el episodio" });
    }
};

// UPDATE
const updateEpisodio = async (req, res) => {
    try {
        const updatedEpisodio = await Episodio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEpisodio) {
            return res.status(404).json({ message: "Episodio no encontrado" });
        }
        res.status(200).json(updatedEpisodio);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el episodio" });
    }
};

// DELETE
const deleteEpisodio = async (req, res) => {
    try {
        const deletedEpisodio = await Episodio.findByIdAndDelete(req.params.id);
        if (!deletedEpisodio) {
            return res.status(404).json({ message: "Episodio no encontrado" });
        }
        const temporada = await Temporada.findById(deletedEpisodio.temporada);
        if (temporada) {
            temporada.episodios.pull(deletedEpisodio._id);
            await temporada.save();
        }
        res.status(200).json({ message: "Episodio eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el episodio" });
    }
};

// READ BY ID DE TEMPORADA
const getEpisodiosByTemporadaId = async (req, res) => {
    try {
        const { temporadaId } = req.params;
        const episodios = await Episodio.find({ temporada: temporadaId }).populate('temporada');
        res.status(200).json(episodios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener episodios por temporada" });
    }
};


module.exports = {
    createEpisodio,
    getAllEpisodios,
    getEpisodioById,
    updateEpisodio,
    deleteEpisodio,
    getEpisodiosByTemporadaId
};