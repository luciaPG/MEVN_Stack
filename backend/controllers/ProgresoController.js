const Progreso = require("../models/Progreso");
const Episodio = require("../models/Episodio");
const User = require("../models/User");
const Serie = require("../models/Serie");
const Temporada = require("../models/Temporada");
const mongoose = require('mongoose');

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

const obtenerTotalEpisodiosSerie = async (serieId) => {
    const temporadas = await Temporada.find({ serie: serieId });
    const temporadasIds = temporadas.map(t => t._id);
    
    const totalEpisodios = await Episodio.countDocuments({
        temporada: { $in: temporadasIds }
    });
    
    return totalEpisodios;
};

// OBTENER SERIES CON PROGRESO PARA UN USUARIO
const getSeriesWithProgress = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        console.log("Procesando solicitud para obtener series con progreso del usuario:", userId);
        
        // Check if userId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("ID de usuario inválido:", userId);
            return res.status(400).json({ message: 'ID de usuario inválido' });
        }
        
        // Get user with its registeredSeries
        const user = await User.findById(userId);
        
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        console.log("Usuario encontrado:", user._id.toString());
        console.log("Registered Series array:", Array.isArray(user.registeredSeries));
        console.log("Registered Series count:", user.registeredSeries ? user.registeredSeries.length : 0);
        
        // Simple fallback - if no registered series, return all series
        // In a production app, you might want to return an empty array instead
        if (!user.registeredSeries || user.registeredSeries.length === 0) {
            console.log("No hay series registradas para este usuario. Mostrando todas las series disponibles.");
            const allSeries = await Serie.find().select('nombre sinopsis genero').lean();
            
            // Process and return all series
            const results = [];
            
            for (const serie of allSeries) {
                // Get temporadas for this serie
                const temporadas = await Temporada.find({ serie: serie._id });
                const temporadaIds = temporadas.map(t => t._id);
                
                // Count episodes
                const totalEpisodios = temporadaIds.length > 0 ?
                    await Episodio.countDocuments({ temporada: { $in: temporadaIds } }) : 0;
                
                // Count watched episodes for this user
                const episodiosVistos = await Progreso.countDocuments({
                    usuario: userId,
                    serie: serie._id,
                    visto: true
                });
                
                // Add to results
                results.push({
                    _id: serie._id,
                    nombre: serie.nombre,
                    sinopsis: serie.sinopsis || "Sin descripción",
                    genero: serie.genero || "Sin género",
                    totalEpisodios,
                    episodiosVistos
                });
            }
            
            return res.json(results);
        }
        
        // If we get here, user has registered series
        console.log("Series registradas:", user.registeredSeries.map(id => id.toString()));
        
        // Get details of registered series
        const seriesData = await Serie.find({
            _id: { $in: user.registeredSeries }
        }).select('nombre sinopsis genero').lean();
        
        console.log("Series encontradas en BD:", seriesData.length);
        
        if (!seriesData || seriesData.length === 0) {
            console.log("No se encontraron las series registradas en la base de datos");
            return res.json([]);
        }
        
        // Process each registered series
        const results = [];
        
        for (const serie of seriesData) {
            try {
                // Get temporadas for this serie
                const temporadas = await Temporada.find({ serie: serie._id });
                const temporadaIds = temporadas.map(t => t._id);
                
                // Count episodes
                const totalEpisodios = temporadaIds.length > 0 ?
                    await Episodio.countDocuments({ temporada: { $in: temporadaIds } }) : 0;
                
                // Count watched episodes for this user
                const episodiosVistos = await Progreso.countDocuments({
                    usuario: userId,
                    serie: serie._id,
                    visto: true
                });
                
                // Add to results
                results.push({
                    _id: serie._id,
                    nombre: serie.nombre,
                    sinopsis: serie.sinopsis || "Sin descripción",
                    genero: serie.genero || "Sin género",
                    totalEpisodios,
                    episodiosVistos
                });
            } catch (error) {
                console.error(`Error procesando serie ${serie._id}:`, error);
            }
        }
        
        return res.json(results);
        
    } catch (error) {
        console.error('Error al obtener series con progreso:', error);
        return res.status(500).json({ 
            message: 'Error al obtener series con progreso', 
            error: error.message 
        });
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

// OBTENER TODAS LAS SERIES DE UN USUARIO
const getSeriesByUser = async (req, res) => {
    try {
        console.log('getSeriesByUser called with params:', req.params);
        // Use id or userId based on what the route provides
        const userId = req.params.id || req.params.userId || req.user._id;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        
        console.log('Finding series for user ID:', userId);
        
        // Encontrar series distintas donde el usuario tiene al menos un episodio visto
        const seriesIds = await Progreso.distinct('serie', {
            usuario: userId,
            visto: true
        });
        
        console.log('Found series IDs:', seriesIds);
        
        if (seriesIds.length === 0) {
            return res.status(200).json([]);
        }
        
        // Explicitly verify Serie model is available
        if (!Serie) {
            console.error('Serie model is not defined!');
            throw new Error('Serie model is not defined');
        }
        
        // Obtener detalles completos de esas series
        const series = await Serie.find({
            _id: { $in: seriesIds }
        }).select('nombre genero sinopsis');
        
        console.log('Found series:', series.length);
        
        // Para cada serie, calcular el progreso
        const seriesConProgreso = await Promise.all(series.map(async (serie) => {
            // Total de episodios de la serie
            const totalEpisodios = await obtenerTotalEpisodiosSerie(serie._id);
            
            // Episodios vistos de esta serie
            const episodiosVistos = await Progreso.countDocuments({
                usuario: userId,
                serie: serie._id,
                visto: true
            });
            
            return {
                _id: serie._id,
                nombre: serie.nombre,
                sinopsis: serie.sinopsis,
                genero: serie.genero,
                totalEpisodios,
                episodiosVistos
            };
        }));
        
        console.log('Returning series with progress:', seriesConProgreso.length);
        
        // Return an array directly for compatibility with the frontend
        return res.status(200).json(seriesConProgreso);
    } catch (error) {
        console.error("Error al obtener series del usuario:", error);
        return res.status(500).json({ 
            message: "Error al obtener las series del usuario", 
            error: error.message 
        });
    }
};

// OBTENER TODAS LAS SERIES - Simplified endpoint
const getUserSeries = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Simple permission check
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para acceder a estos datos' });
        }
        
        // Get the user's registered series
        const user = await User.findById(userId).populate({
            path: 'registeredSeries',
            select: 'nombre sinopsis genero anioInicio anioFin'
        });
        
        if (!user || !user.registeredSeries.length) {
            return res.json([]);
        }
        
        // Return just the series data
        res.json(user.registeredSeries);
        
    } catch (error) {
        console.error('Error al obtener series del usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// OBTENER PROGRESO DE UNA SERIE ESPECÍFICA
const getSerieProgress = async (req, res) => {
    try {
        const { userId, serieId } = req.params;
        
        // Simple permission check
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para acceder a estos datos' });
        }
        
        // Get total episodes for the serie
        const temporadaIds = await Temporada.find({ serie: serieId }).distinct('_id');
        const totalEpisodios = await Episodio.countDocuments({ 
            temporada: { $in: temporadaIds } 
        });
        
        // Get watched episodes
        const episodiosVistos = await Progreso.countDocuments({
            usuario: userId,
            serie: serieId,
            visto: true
        });
        
        // Return the progress data
        res.json({
            serieId,
            totalEpisodios,
            episodiosVistos,
            porcentaje: totalEpisodios > 0 ? Math.round((episodiosVistos / totalEpisodios) * 100) : 0
        });
        
    } catch (error) {
        console.error('Error al obtener progreso de la serie:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = {
    createProgreso,
    getProgresoByUserId,
    getProgresoByEpisodioId,
    updateProgreso,
    deleteProgreso,
    getSeriesByUser,
    getSeriesWithProgress,
    getUserSeries,
    getSerieProgress
};