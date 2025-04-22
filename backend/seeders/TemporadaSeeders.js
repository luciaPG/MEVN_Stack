const Temporada = require('../models/Temporada');
const Serie = require('../models/Serie');

const seedTemporadas = async () => {
    try {
        await Temporada.deleteMany({});

        const breakingBad = await Serie.findOne({ nombre: 'Breaking Bad' });
        const strangerThings = await Serie.findOne({ nombre: 'Stranger Things' });
        const gameOfThrones = await Serie.findOne({ nombre: 'Game of Thrones' });
        const theCrown = await Serie.findOne({ nombre: 'The Crown' });
        const theMandolorian = await Serie.findOne({ nombre: 'The Mandalorian' });

        const temporadas = [
            // Breaking Bad
            { numeroTemporada: 1, episodios: [], serie: breakingBad._id },
            { numeroTemporada: 2, episodios: [], serie: breakingBad._id },
            { numeroTemporada: 3, episodios: [], serie: breakingBad._id },
            { numeroTemporada: 4, episodios: [], serie: breakingBad._id },
            { numeroTemporada: 5, episodios: [], serie: breakingBad._id },
        
            // Stranger Things
            { numeroTemporada: 1, episodios: [], serie: strangerThings._id },
            { numeroTemporada: 2, episodios: [], serie: strangerThings._id },
            { numeroTemporada: 3, episodios: [], serie: strangerThings._id },
            { numeroTemporada: 4, episodios: [], serie: strangerThings._id },

            // Game of Thrones
            { numeroTemporada: 1, episodios: [], serie: gameOfThrones._id },
            { numeroTemporada: 2, episodios: [], serie: gameOfThrones._id },
            { numeroTemporada: 3, episodios: [], serie: gameOfThrones._id },
            { numeroTemporada: 4, episodios: [], serie: gameOfThrones._id },
            { numeroTemporada: 5, episodios: [], serie: gameOfThrones._id },
            { numeroTemporada: 6, episodios: [], serie: gameOfThrones._id },
            { numeroTemporada: 7, episodios: [], serie: gameOfThrones._id },
            { numeroTemporada: 8, episodios: [], serie: gameOfThrones._id },

            // The Crown
            { numeroTemporada: 1, episodios: [], serie: theCrown._id },
            { numeroTemporada: 2, episodios: [], serie: theCrown._id },
            { numeroTemporada: 3, episodios: [], serie: theCrown._id },
            { numeroTemporada: 4, episodios: [], serie: theCrown._id },
            { numeroTemporada: 5, episodios: [], serie: theCrown._id },
            { numeroTemporada: 6, episodios: [], serie: theCrown._id },

            // The Mandalorian
            { numeroTemporada: 1, episodios: [], serie: theMandolorian._id },
            { numeroTemporada: 2, episodios: [], serie: theMandolorian._id },
            { numeroTemporada: 3, episodios: [], serie: theMandolorian._id },
        
        ];

        await Temporada.insertMany(temporadas);
        console.log('🌱 Temporadas sembradas correctamente');
    } catch (error) {
        console.error('Error al sembrar temporadas:', error);
    }
};

module.exports = seedTemporadas;