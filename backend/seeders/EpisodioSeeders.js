const mongoose = require('mongoose');
const Temporada = require('../models/Temporada');
const Episodio = require('../models/Episodio');

const seedEpisodios = async () => {
  console.log('Iniciando sembrado de episodios...');
  
  try {
    // Eliminar episodios existentes
    await Episodio.deleteMany({});
    console.log('Episodios anteriores eliminados');
    
    // Obtener todas las temporadas
    const temporadas = await Temporada.find({});
    console.log(`Encontradas ${temporadas.length} temporadas para crear episodios`);
    
    if (temporadas.length === 0) {
      console.log('No hay temporadas para crear episodios');
      return [];
    }
    
    // Array para almacenar los episodios creados
    const episodiosCreados = [];
    
    // Para cada temporada, crear entre 8 y 15 episodios
    for (const temporada of temporadas) {
      const numEpisodios = Math.floor(Math.random() * 8) + 8; // Entre 8 y 15 episodios
      console.log(`Creando ${numEpisodios} episodios para Temporada ${temporada.numero}`);
      
      // Crear los episodios para esta temporada
      const episodiosDeTemporada = [];
      
      for (let i = 1; i <= numEpisodios; i++) {
        const episodio = new Episodio({
          numero: i,
          titulo: `Episodio ${i}`,
          descripcion: `Episodio ${i} de la Temporada ${temporada.numero}`,
          temporada: temporada._id,
          duracion: Math.floor(Math.random() * 30) + 30, // Entre 30 y 59 minutos
          fechaEmision: new Date(temporada.anio, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        });
        
        await episodio.save();
        episodiosDeTemporada.push(episodio);
        episodiosCreados.push(episodio);
      }
      
      // Actualizar la temporada con las referencias a sus episodios
      temporada.episodios = episodiosDeTemporada.map(e => e._id);
      await temporada.save();
      
      console.log(`✓ ${episodiosDeTemporada.length} episodios creados para Temporada ${temporada.numero}`);
    }
    
    console.log(`Episodios sembrados correctamente`);
    return episodiosCreados;
    
  } catch (error) {
    console.error('Error al sembrar episodios:', error.message);
    return [];
  }
};

module.exports = seedEpisodios;