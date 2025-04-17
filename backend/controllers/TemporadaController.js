const Temporada = require('../models/Temporada');
const Serie = require('../models/Serie');
const Episodio = require('../models/Episodio');

// CREATE
const createTemporada = async (req, res) => {
    try {
        const existingTemporada = await Temporada.findOne({ serie: req.body.serie, numeroTemporada: req.body.numeroTemporada });
        if (existingTemporada) {
            return res.status(400).json({ message: "Ya existe una temporada con ese número para esta serie" });
        }
        const serieExistente = await Serie.findById(req.body.serie);
        if (!serieExistente) {
            return res.status(404).json({ message: "Serie no encontrada" });
        }
        const nuevaTemporada = new Temporada(req.body);
        await nuevaTemporada.save();
        res.status(201).json(nuevaTemporada);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la temporada" });
    }
};

// READ ALL todas las temporadas de la base de datos
const getAllTemporadas = async (req, res) => {
    try {
        const temporadas = await Temporada.find().populate('serie');
        res.status(200).json(temporadas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener temporadas" });
    }
};

// READ BY ID
const getTemporadaById = async (req, res) => {
    try {
        const temporada = await Temporada.findById(req.params.id).populate('serie');
        if (!temporada) {
            return res.status(404).json({ message: "Temporada no encontrada" });
        }
        res.status(200).json(temporada);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la temporada" });
    }
};

// UPDATE
const updateTemporada = async (req, res) => {
    try {
        const updatedTemporada = await Temporada.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedTemporada) {
            return res.status(404).json({ message: "Temporada no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la temporada" });
    }
};

// DELTE 
const deleteTemporada = async (req, res) => {
    try {
        const deletedTemporada = await Temporada.findByIdAndDelete(req.params.id);
        if (!deletedTemporada) {
            return res.status(404).json({ message: "Temporada no encontrada" });
        }
        await Episodio.deleteMany({ temporada: req.params.id });
        res.status(200).json({ message: "Temporada eliminada junto a sus episodios" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la temporada" });
    }
};

//READ BY ID DE SERIE
const getTemporadasBySerieId = async (req, res) => {
    try {
        const { serieId } = req.params;
        const temporadas = await Temporada.find({ serie: serieId }).populate('serie');
        res.status(200).json(temporadas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener temporadas por ID de serie" });
    }
};



module.exports = {
    createTemporada,
    getAllTemporadas,
    getTemporadaById,
    updateTemporada,
    deleteTemporada,
    getTemporadasBySerieId,
};