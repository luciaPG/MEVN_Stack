const mongoose = require('mongoose');
const Serie = require('../models/Serie');
const Temporada = require('../models/Temporada');

const seedTemporadas = async () => {
  console.log('Iniciando sembrado de temporadas...');
  
  try {
    // Eliminar temporadas existentes
    await Temporada.deleteMany({});
    console.log('Temporadas anteriores eliminadas');
    
    // Obtener todas las series
    const series = await Serie.find({});
    console.log(`Encontradas ${series.length} series para crear temporadas`);
    
    if (series.length === 0) {
      console.log('No hay series para crear temporadas');
      return [];
    }
    
    // Array para almacenar las temporadas creadas
    const temporadasCreadas = [];
    
    // Para cada serie, crear entre 3 y 8 temporadas
    for (const serie of series) {
      const numTemporadas = Math.floor(Math.random() * 6) + 3; // Entre 3 y 8 temporadas
      console.log(`Creando ${numTemporadas} temporadas para "${serie.nombre}"`);
      
      // Crear las temporadas para esta serie
      const temporadasDeSerie = [];
      
      for (let i = 1; i <= numTemporadas; i++) {
        const temporada = new Temporada({
          numero: i,
          titulo: `Temporada ${i}`,
          descripcion: `Temporada ${i} de ${serie.nombre}`,
          serie: serie._id,
          anio: serie.anioInicio + i - 1,
          episodios: [] // Se rellenarán después
        });
        
        await temporada.save();
        temporadasDeSerie.push(temporada);
        temporadasCreadas.push(temporada);
      }
      
      // Actualizar la serie con las referencias a sus temporadas
      serie.temporadas = temporadasDeSerie.map(t => t._id);
      await serie.save();
      
      console.log(`✓ ${temporadasDeSerie.length} temporadas creadas para "${serie.nombre}"`);
    }
    
    console.log(`Temporadas sembradas correctamente`);
    return temporadasCreadas;
    
  } catch (error) {
    console.error('Error al sembrar temporadas:', error.message);
    return [];
  }
};

module.exports = seedTemporadas;