const Episodio = require('../models/Episodio');
const Temporada = require('../models/Temporada');

const seedEpisodios = async () => {
    try {
        await Episodio.deleteMany({});
            
            const temporadas = await Temporada.find({});
    
            const episodios = [
                // Breaking Bad
                { nombre: 'Pilot', sinopsis: 'El primer episodio de la serie.', temporada: temporadas[0]._id, numeroEpisodio: 1, fechaEstreno: new Date('2008-01-20') },
                { nombre: 'Cat\'s in the Bag...', sinopsis: 'Walter y Jesse lidian con las consecuencias de sus acciones.', temporada: temporadas[0]._id, numeroEpisodio: 2, fechaEstreno: new Date('2008-01-27') },
                { nombre: '...And the Bag\'s in the River', sinopsis: 'Walter enfrenta una difícil decisión.', temporada: temporadas[0]._id, numeroEpisodio: 3, fechaEstreno: new Date('2008-02-10') },
                
                // Stranger Things
                { nombre: 'Chapter One: Stranger Things', sinopsis: 'Un niño desaparece y sus amigos buscan respuestas.', temporada: temporadas[5]._id, numeroEpisodio: 1, fechaEstreno: new Date('2016-07-15') },
                { nombre: 'Chapter Two: The Weirdo on Maple Street', sinopsis: 'Los amigos de Will se encuentran con una misteriosa niña.', temporada: temporadas[5]._id, numeroEpisodio: 2, fechaEstreno: new Date('2016-07-15') },
                { nombre: 'Chapter Three: Holly, Jolly', sinopsis: 'La búsqueda de Will continúa.', temporada: temporadas[5]._id, numeroEpisodio: 3, fechaEstreno: new Date('2016-07-15') },

                // Game of Thrones
                { nombre: 'Winter Is Coming', sinopsis: 'La historia comienza en Westeros.', temporada: temporadas[9]._id, numeroEpisodio: 1, fechaEstreno: new Date('2011-04-17') },
                { nombre: 'The Kingsroad', sinopsis: 'Los Stark viajan al sur.', temporada: temporadas[9]._id, numeroEpisodio: 2, fechaEstreno: new Date('2011-04-24') },
                { nombre: 'Lord Snow', sinopsis: 'Eddard Stark llega a Desembarco del Rey.', temporada: temporadas[9]._id, numeroEpisodio: 3, fechaEstreno: new Date('2011-05-01') },

                // The Crown
                { nombre: 'Wolferton Splash', sinopsis: 'La historia de la Reina Isabel II comienza.', temporada: temporadas[12]._id, numeroEpisodio: 1, fechaEstreno: new Date('2016-11-04') },
                { nombre: 'Hyde Park Corner', sinopsis: 'La Reina se enfrenta a nuevos desafíos.', temporada: temporadas[12]._id, numeroEpisodio: 2, fechaEstreno: new Date('2016-11-04') },
                { nombre: 'Windsor', sinopsis: 'La familia real se enfrenta a una crisis.', temporada: temporadas[12]._id, numeroEpisodio: 3, fechaEstreno: new Date('2016-11-04') },

                // The Mandalorian
                { nombre: 'Chapter 1: The Mandalorian', sinopsis: 'Un cazarrecompensas solitario navega por la galaxia.', temporada: temporadas[15]._id, numeroEpisodio: 1, fechaEstreno: new Date('2019-11-12') },
                { nombre: 'Chapter 2: The Child', sinopsis: 'El Mandaloriano encuentra a un extraño niño.', temporada: temporadas[15]._id, numeroEpisodio: 2, fechaEstreno: new Date('2019-11-15') },
                { nombre: 'Chapter 3: The Sin', sinopsis: 'El Mandaloriano enfrenta una difícil decisión.', temporada: temporadas[15]._id, numeroEpisodio: 3, fechaEstreno: new Date('2019-11-22') },
            ];
    
            await Episodio.insertMany(episodios);
            console.log('🌱 Episodios sembrados correctamente');

        
    } catch (error) {
        console.error('Error al sembrar episodios:', error);
    }
};

module.exports = seedEpisodios;