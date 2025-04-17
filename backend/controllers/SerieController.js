const Serie = require("../models/Serie");

// CREATE
const createSerie = async (req, res) => {
    try{
        const nuevaSerie = new Serie(req.body);
        await nuevaSerie.save();
        res.status(201).json(nuevaSerie);
    } catch {
        res.status(500).json({ message: "Error al crear la serie" });
    }
};

// READ ALL
const getAllSeries = async (req, res) => {
    try {
        const series = await Serie.find();
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener series" });
    }
};

// READ BY ID
const getSerieById = async (req, res) => {
    try {
        const serie = await Serie.findById(req.params.id);
        if (!serie) {
            return res.status(404).json({ message: "Serie no encontrada" });
        }
        res.status(200).json(serie);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la serie" });
    }
};

// UPDATE
const updateSerie = async (req, res) => {
    try {
        const updatedSerie = await Serie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSerie) {
            return res.status(404).json({ message: "Serie no encontrada" });
        }
        res.status(200).json(updatedSerie);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la serie" });
    }
};

// DELETE
const deleteSerie = async (req, res) => {
    try {
        const deletedSerie = await Serie.findByIdAndDelete(req.params.id);
        if (!deletedSerie) {
            return res.status(404).json({ message: "Serie no encontrada" });
        }
        res.status(200).json({ message: "Serie eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la serie" });
    }
};


module.exports = {
    createSerie,
    getAllSeries,
    getSerieById,
    updateSerie,
    deleteSerie,
}