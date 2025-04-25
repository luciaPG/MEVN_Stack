const Serie = require("../models/Serie");
const Temporada = require("../models/Temporada");
const Episodio = require("../models/Episodio");
const User = require("../models/User");

// CREATE
const createSerie = async (req, res) => {
    try {
        const { nombre, sinopsis, genero, isPublic = true, usuario } = req.body;
        
        if (!nombre || !sinopsis || !genero) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }
        
        const query = { nombre };
        if (usuario) {
            query.usuario = usuario;
        }
        
        const existingSerie = await Serie.findOne(query);
        if (existingSerie) {
            return res.status(400).json({ message: "Ya tienes una serie con este nombre" });
        }
        
        const nuevaSerie = new Serie({
            ...req.body,
            isPublic: isPublic
        });
        await nuevaSerie.save();
        res.status(201).json(nuevaSerie);
    } catch (error) {
        console.error('Error al crear serie:', error);
        res.status(500).json({ message: "Error al crear la serie" });
    }
};

// READ ALL SERIES (NO AUTH REQUIRED)
const getAllSeries = async (req, res) => {
    try {
        const series = await Serie.find();
        res.status(200).json(series);
    } catch (error) {
        console.error('Error al obtener todas las series:', error);
        res.status(500).json({ message: "Error al obtener todas las series" });
    }
};

// READ BY USER ID (SERIES UPLOADED BY USER)
const getSeriesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('registeredSeries');
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(user.registeredSeries);
    } catch (error) {
        console.error('Error al obtener series del usuario:', error);
        res.status(500).json({ message: "Error al obtener series del usuario" });
    }
};

const registerSeriesToUser = async (req, res) => {
    try {
        const { serieId,userId  } = req.body;
        
        if (!userId || !serieId) {
            return res.status(400).json({ message: "Se requiere ID de usuario y serie" });
        }

        const user = await User.findById(userId);
        console.log(user);
        if (!user) {
            console.error('Usuario no encontrado:', userId);
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const serie = await Serie.findById(serieId);
        if (!serie) {
            console.error('Serie no encontrada:', serieId);
            return res.status(404).json({ message: "Serie no encontrada" });
        }

        if (!user.registeredSeries) {
            user.registeredSeries = [];
        }

        if (user.registeredSeries.includes(serieId)) {
            return res.status(400).json({ message: "Esta serie ya está registrada en tu perfil" });
        }

        user.registeredSeries.push(serieId);
        await user.save();

        res.status(200).json({ message: "Serie registrada correctamente en tu perfilllllllllllllllllll" });
    } catch (error) {
        console.error('Error al registrar serie para usuario:', error);
        res.status(500).json({ message: "Error al registrar serie" });
    }
};


// UNREGISTER SERIES FROM USER PROFILE
const unregisterSeriesFromUser = async (req, res) => {
    try {
         const { serieId, userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (!user.registeredSeries || !user.registeredSeries.includes(serieId)) {
            return res.status(400).json({ message: "Esta serie no está en tu perfil" });
        }

        user.registeredSeries = user.registeredSeries.filter(
            id => id.toString() !== serieId
        );
        await user.save();

        res.status(200).json({ message: "Serie eliminada de tu perfil" });
    } catch (error) {
        console.error('Error al eliminar serie del perfil de usuario:', error);
        res.status(500).json({ message: "Error al eliminar serie del perfil" });
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
        console.error('Error al obtener serie por ID:', error);
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
        console.error('Error al actualizar serie:', error);
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
        
        // Delete related temporadas
        await Temporada.deleteMany({ serie: req.params.id });
        
        // Delete related episodios
        if (deletedSerie.temporadas && deletedSerie.temporadas.length > 0) {
            await Episodio.deleteMany({ temporada: { $in: deletedSerie.temporadas } });
        }
        
        // Also remove this serie from any user's registeredSeries
        await User.updateMany(
            { registeredSeries: req.params.id },
            { $pull: { registeredSeries: req.params.id } }
        );
        
        res.status(200).json({ message: "Serie eliminada junto a sus temporadas y episodios" });
    } catch (error) {
        console.error('Error al eliminar serie:', error);
        res.status(500).json({ message: "Error al eliminar la serie" });
    }
};

module.exports = {
    createSerie,
    getAllSeries,
    getSerieById,
    updateSerie,
    deleteSerie,
    getSeriesByUserId,
    registerSeriesToUser,
    unregisterSeriesFromUser
};