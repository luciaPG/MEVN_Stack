const mongoose = require('mongoose');
const User = require('../models/User');
const Serie = require('../models/Serie');
const Temporada = require('../models/Temporada');
const Episodio = require('../models/Episodio');

async function seedProgreso() {
  console.log('🌱 INICIANDO SEMBRADO DE PROGRESO');
  
  try {
    // Verificar conexión
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ No hay conexión activa a MongoDB');
      return [];
    }
    
    // Obtener acceso directo a la base de datos
    const db = mongoose.connection.db;
    
    // 1. Limpiar datos de progreso existentes
    console.log('\n1️⃣ LIMPIANDO DATOS EXISTENTES');
    
    // Limpiar colección de progresos
    await db.collection('progresos').deleteMany({});
    console.log('✅ Colección de progresos limpiada');
    
    // 2. Cargar datos necesarios
    console.log('\n2️⃣ CARGANDO DATOS NECESARIOS');
    
    const usuarios = await User.find({});
    console.log(`Usuarios encontrados: ${usuarios.length}`);
    
    // Primero verificamos si hay episodios
    const episodios = await Episodio.find({});
    console.log(`Episodios encontrados: ${episodios.length}`);
    
    if (episodios.length === 0) {
      console.log('⚠️ No hay episodios para marcar como vistos');
      
      // Comprobamos si hay temporadas y series para diagnosticar el problema
      const temporadas = await Temporada.find({});
      console.log(`Temporadas encontradas: ${temporadas.length}`);
      
      const series = await Serie.find({});
      console.log(`Series encontradas: ${series.length}`);
      
      if (series.length > 0 && temporadas.length === 0) {
        // Este es probablemente el problema - hay series pero no temporadas
        console.log('🔍 Diagnóstico: Hay series pero no temporadas. Verifica el seeder de temporadas');
      }
      
      // Solo registramos las series a los usuarios pero sin progreso
      console.log('👤 Solo registraremos series a los usuarios pero sin progreso');
      
      // Usuario 1 - Todas las series
      if (usuarios.length > 0) {
        const user1 = usuarios[0];
        const series = await Serie.find({});
        user1.registeredSeries = series.map(s => s._id);
        await user1.save();
        console.log(`✅ ${series.length} series registradas para ${user1.username}`);
      }
      
      // Usuario 2 - Primeras 2 series
      if (usuarios.length > 1) {
        const user2 = usuarios[1];
        const series = await Serie.find({}).limit(2);
        user2.registeredSeries = series.map(s => s._id);
        await user2.save();
        console.log(`✅ ${series.length} series registradas para ${user2.username}`);
      }
      
      // Admin - Todas las series
      const admin = usuarios.find(u => u.role === 'admin');
      if (admin) {
        const series = await Serie.find({});
        admin.registeredSeries = series.map(s => s._id);
        await admin.save();
        console.log(`✅ ${series.length} series registradas para ${admin.username}`);
      }
      
      console.log('✅ SEMBRADO PARCIAL COMPLETADO (SOLO SERIES REGISTRADAS)');
      return [];
    }
    
    // Obtener todas las series con sus temporadas y episodios
    const series = await Serie.find({});
    console.log(`Series encontradas: ${series.length}`);
    
    if (usuarios.length === 0 || series.length === 0) {
      console.log('⚠️ No hay suficientes datos para crear progreso');
      return [];
    }
    
    // Crear un mapa para acceder rápidamente a los episodios por serie
    const episodiosPorSerie = {};
    
    // Agrupar episodios por serie para acceder rápidamente
    for (const episodio of episodios) {
      const temporada = await Temporada.findById(episodio.temporada);
      if (temporada) {
        const serieId = temporada.serie.toString();
        if (!episodiosPorSerie[serieId]) {
          episodiosPorSerie[serieId] = [];
        }
        episodiosPorSerie[serieId].push(episodio);
      }
    }
    
    // 3. Distribución de series por usuario
    console.log('\n3️⃣ DISTRIBUYENDO SERIES POR USUARIO');
    
    // Patrones de usuario:
    // - Usuario 1: Todas las series, progreso variado
    // - Usuario 2: Primeras 2 series, una completa y otra a medias
    // - Admin: Todas las series, casi todo completado
    
    const progresos = [];
    
    // Usuario 1 - Todas las series, progreso variado
    if (usuarios.length > 0) {
      const user1 = usuarios[0];
      console.log(`\nConfig. Usuario 1: ${user1.username} - Todas las series, progreso variado`);
      
      // Registrar todas las series
      user1.registeredSeries = [];
      series.forEach(serie => user1.registeredSeries.push(serie._id));
      await user1.save();
      console.log(`✅ ${series.length} series registradas para ${user1.username}`);
      
      // Por cada serie, marcar los episodios si están disponibles
      for (const serie of series) {
        console.log(`- Serie: ${serie.nombre}`);
        
        const episodiosDeSerie = episodiosPorSerie[serie._id.toString()] || [];
        if (episodiosDeSerie.length > 0) {
          // Marcar ~40% de episodios como vistos
          const episodiosAMarcar = Math.ceil(episodiosDeSerie.length * 0.4);
          for (let i = 0; i < episodiosAMarcar && i < episodiosDeSerie.length; i++) {
            const episodio = episodiosDeSerie[i];
            
            progresos.push({
              usuario: user1._id,
              serie: serie._id,
              episodio: episodio._id,
              visto: true,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          console.log(`  ✓ ${Math.min(episodiosAMarcar, episodiosDeSerie.length)} episodios marcados`);
        } else {
          console.log(`  ⚠️ No hay episodios disponibles para esta serie`);
        }
      }
    }
    
    // Usuario 2 - Primeras 2 series
    if (usuarios.length > 1 && series.length > 1) {
      const user2 = usuarios[1];
      console.log(`\nConfig. Usuario 2: ${user2.username} - 2 series, progreso mixto`);
      
      // Registrar solo las primeras 2 series
      const seriesUser2 = series.slice(0, 2);
      user2.registeredSeries = seriesUser2.map(s => s._id);
      await user2.save();
      console.log(`✅ ${seriesUser2.length} series registradas para ${user2.username}`);
      
      // Primera serie - Completa
      if (seriesUser2.length > 0) {
        const serie1 = seriesUser2[0];
        console.log(`- Serie completa: ${serie1.nombre}`);
        
        const episodiosDeSerie1 = episodiosPorSerie[serie1._id.toString()] || [];
        if (episodiosDeSerie1.length > 0) {
          for (const episodio of episodiosDeSerie1) {
            progresos.push({
              usuario: user2._id,
              serie: serie1._id,
              episodio: episodio._id,
              visto: true,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          console.log(`  ✓ ${episodiosDeSerie1.length} episodios marcados`);
        } else {
          console.log(`  ⚠️ No hay episodios disponibles para esta serie`);
        }
      }
      
      // Segunda serie - A medias (solo la mitad)
      if (seriesUser2.length > 1) {
        const serie2 = seriesUser2[1];
        console.log(`- Serie a medias: ${serie2.nombre}`);
        
        const episodiosDeSerie2 = episodiosPorSerie[serie2._id.toString()] || [];
        if (episodiosDeSerie2.length > 0) {
          // Marcar solo la mitad
          const mitad = Math.ceil(episodiosDeSerie2.length / 2);
          
          for (let i = 0; i < mitad; i++) {
            const episodio = episodiosDeSerie2[i];
            
            progresos.push({
              usuario: user2._id,
              serie: serie2._id,
              episodio: episodio._id,
              visto: true,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          console.log(`  ✓ ${mitad} episodios marcados`);
        } else {
          console.log(`  ⚠️ No hay episodios disponibles para esta serie`);
        }
      }
    }
    
    // Admin - Todas las series, casi todo completado
    const admin = usuarios.find(u => u.role === 'admin');
    if (admin) {
      console.log(`\nConfig. Admin: ${admin.username} - Todas las series, casi completadas`);
      
      // Registrar todas las series
      admin.registeredSeries = series.map(s => s._id);
      await admin.save();
      console.log(`✅ ${series.length} series registradas para ${admin.username}`);
      
      // Marcar casi todos los episodios (90%)
      for (const serie of series) {
        console.log(`- Serie: ${serie.nombre}`);
        
        const episodiosDeSerie = episodiosPorSerie[serie._id.toString()] || [];
        if (episodiosDeSerie.length > 0) {
          // Marcar 90% de episodios
          const aMarcas = Math.ceil(episodiosDeSerie.length * 0.9);
          
          for (let i = 0; i < aMarcas; i++) {
            const episodio = episodiosDeSerie[i];
            
            progresos.push({
              usuario: admin._id,
              serie: serie._id,
              episodio: episodio._id,
              visto: true,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          console.log(`  ✓ ${aMarcas} episodios marcados`);
        } else {
          console.log(`  ⚠️ No hay episodios disponibles para esta serie`);
        }
      }
    }
    
    // 4. Insertar todos los progresos
    console.log(`\n4️⃣ INSERTANDO ${progresos.length} REGISTROS DE PROGRESO`);
    
    if (progresos.length > 0) {
      const resultado = await db.collection('progresos').insertMany(progresos);
      console.log(`✅ Insertados ${resultado.insertedCount} registros`);
      
      // Verificar total de registros
      const totalEnBD = await db.collection('progresos').countDocuments();
      console.log(`Total de progresos en la BD: ${totalEnBD}`);
    } else {
      console.log('⚠️ No hay registros para insertar');
    }
    
    // 5. Mostrar resumen
    console.log('\n5️⃣ RESUMEN DE PROGRESO POR USUARIO');
    
    for (const usuario of usuarios) {
      const seriesRegistradas = await User.findById(usuario._id)
        .populate('registeredSeries', 'nombre')
        .then(u => u.registeredSeries);
      
      const progresosPorSerie = await db.collection('progresos')
        .aggregate([
          { $match: { usuario: usuario._id } },
          { $group: { _id: '$serie', episodiosVistos: { $sum: 1 } } }
        ]).toArray();
      
      console.log(`\nUsuario: ${usuario.username}`);
      console.log(`Series registradas: ${seriesRegistradas.length}`);
      console.log('Progreso por serie:');
      
      for (const serieRegistrada of seriesRegistradas) {
        const progresoDeSerie = progresosPorSerie.find(p => 
          p._id.toString() === serieRegistrada._id.toString()
        );
        
        const episodiosVistos = progresoDeSerie ? progresoDeSerie.episodiosVistos : 0;
        console.log(`- ${serieRegistrada.nombre}: ${episodiosVistos} episodios vistos`);
      }
    }
    
    console.log('\n✅ SEMBRADO DE PROGRESO COMPLETADO');
    
    // Retornar los progresos creados
    return progresos;
    
  } catch (error) {
    console.error('❌ Error en seedProgreso:', error);
    throw error;
  }
}

module.exports = seedProgreso;