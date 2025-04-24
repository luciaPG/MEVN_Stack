const Episodio = require('../models/Episodio');
const Temporada = require('../models/Temporada');
const Serie = require('../models/Serie');

const seedEpisodios = async () => {
    try {
        await Episodio.deleteMany({});
        
        // Fetch series first
        const breakingBad = await Serie.findOne({ nombre: 'Breaking Bad' });
        const strangerThings = await Serie.findOne({ nombre: 'Stranger Things' });
        const gameOfThrones = await Serie.findOne({ nombre: 'Game of Thrones' });
        const theCrown = await Serie.findOne({ nombre: 'The Crown' });
        const mandalorian = await Serie.findOne({ nombre: 'The Mandalorian' });
        
        if (!breakingBad || !strangerThings || !gameOfThrones || !theCrown || !mandalorian) {
            console.error('Una o más series no se encontraron para poblar los episodios');
            return;
        }

        // Fetch temporadas by series and season number
        const bbTemp1 = await Temporada.findOne({ serie: breakingBad._id, numeroTemporada: 1 });
        const stTemp1 = await Temporada.findOne({ serie: strangerThings._id, numeroTemporada: 1 });
        const gotTemp1 = await Temporada.findOne({ serie: gameOfThrones._id, numeroTemporada: 1 });
        const crownTemp1 = await Temporada.findOne({ serie: theCrown._id, numeroTemporada: 1 });
        const mandoTemp1 = await Temporada.findOne({ serie: mandalorian._id, numeroTemporada: 1 });
        
        if (!bbTemp1 || !stTemp1 || !gotTemp1 || !crownTemp1 || !mandoTemp1) {
            console.error('Una o más temporadas no se encontraron para poblar los episodios');
            return;
        }

        const episodios = [
            // Breaking Bad
            { nombre: 'Pilot', sinopsis: 'El primer episodio de la serie.', temporada: bbTemp1._id, numeroEpisodio: 1, fechaEstreno: new Date('2008-01-20') },
            { nombre: 'Cat\'s in the Bag...', sinopsis: 'Walter y Jesse lidian con las consecuencias de sus acciones.', temporada: bbTemp1._id, numeroEpisodio: 2, fechaEstreno: new Date('2008-01-27') },
            { nombre: '...And the Bag\'s in the River', sinopsis: 'Walter enfrenta una difícil decisión.', temporada: bbTemp1._id, numeroEpisodio: 3, fechaEstreno: new Date('2008-02-10') },
            
            // Stranger Things
            { nombre: 'Chapter One: Stranger Things', sinopsis: 'Un niño desaparece y sus amigos buscan respuestas.', temporada: stTemp1._id, numeroEpisodio: 1, fechaEstreno: new Date('2016-07-15') },
            { nombre: 'Chapter Two: The Weirdo on Maple Street', sinopsis: 'Los amigos de Will se encuentran con una misteriosa niña.', temporada: stTemp1._id, numeroEpisodio: 2, fechaEstreno: new Date('2016-07-15') },
            { nombre: 'Chapter Three: Holly, Jolly', sinopsis: 'La búsqueda de Will continúa.', temporada: stTemp1._id, numeroEpisodio: 3, fechaEstreno: new Date('2016-07-15') },

            // Game of Thrones
            { nombre: 'Winter Is Coming', sinopsis: 'La historia comienza en Westeros.', temporada: gotTemp1._id, numeroEpisodio: 1, fechaEstreno: new Date('2011-04-17') },
            { nombre: 'The Kingsroad', sinopsis: 'Los Stark viajan al sur.', temporada: gotTemp1._id, numeroEpisodio: 2, fechaEstreno: new Date('2011-04-24') },
            { nombre: 'Lord Snow', sinopsis: 'Eddard Stark llega a Desembarco del Rey.', temporada: gotTemp1._id, numeroEpisodio: 3, fechaEstreno: new Date('2011-05-01') },

            // The Crown
            { nombre: 'Wolferton Splash', sinopsis: 'La historia de la Reina Isabel II comienza.', temporada: crownTemp1._id, numeroEpisodio: 1, fechaEstreno: new Date('2016-11-04') },
            { nombre: 'Hyde Park Corner', sinopsis: 'La Reina se enfrenta a nuevos desafíos.', temporada: crownTemp1._id, numeroEpisodio: 2, fechaEstreno: new Date('2016-11-04') },
            { nombre: 'Windsor', sinopsis: 'La familia real se enfrenta a una crisis.', temporada: crownTemp1._id, numeroEpisodio: 3, fechaEstreno: new Date('2016-11-04') },

            // The Mandalorian
            { nombre: 'Chapter 1: The Mandalorian', sinopsis: 'Un cazarrecompensas solitario navega por la galaxia.', temporada: mandoTemp1._id, numeroEpisodio: 1, fechaEstreno: new Date('2019-11-12') },
            { nombre: 'Chapter 2: The Child', sinopsis: 'El Mandaloriano encuentra a un extraño niño.', temporada: mandoTemp1._id, numeroEpisodio: 2, fechaEstreno: new Date('2019-11-15') },
            { nombre: 'Chapter 3: The Sin', sinopsis: 'El Mandaloriano enfrenta una difícil decisión.', temporada: mandoTemp1._id, numeroEpisodio: 3, fechaEstreno: new Date('2019-11-22') },
        ];

        // After creating episodes, update the temporada.episodios array
        const insertedEpisodios = await Episodio.insertMany(episodios);
        
        // Group episodes by temporada
        const episodiosByTemporada = {};
        insertedEpisodios.forEach(ep => {
            if (!episodiosByTemporada[ep.temporada]) {
                episodiosByTemporada[ep.temporada] = [];
            }
            episodiosByTemporada[ep.temporada].push(ep._id);
        });
        
        // Update each temporada with its episodes
        for (const [temporadaId, episodioIds] of Object.entries(episodiosByTemporada)) {
            await Temporada.findByIdAndUpdate(temporadaId, {
                $set: { episodios: episodioIds }
            });
        }
        
        console.log('🌱 Episodios sembrados correctamente');
    } catch (error) {
        console.error('Error al sembrar episodios:', error);
    }
};

module.exports = seedEpisodios;