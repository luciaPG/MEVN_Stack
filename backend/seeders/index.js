const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Nombre de la base de datos
const DB_NAME = 'MEVN_Stack';
const MONGO_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;

// Import models instead of redefining them
const User = require('../models/User');
const Serie = require('../models/Serie');
const Temporada = require('../models/Temporada');
const Episodio = require('../models/Episodio');
const Progreso = require('../models/Progreso');

// Función principal para ejecutar todos los seeders
async function runAllSeeders() {
  let connection = null;
  
  try {
    // Don't connect if mongoose is already connected (prevents multiple connection error)
    if (mongoose.connection.readyState === 0) {
      connection = await mongoose.connect(MONGO_URI);
      console.log(`🌐 Conectado a MongoDB: ${MONGO_URI}`);
    } else {
      console.log('🌐 Utilizando conexión existente a MongoDB');
    }
    
    // Limpiar datos existentes
    console.log('\n🧹 LIMPIANDO DATOS EXISTENTES');
    await User.deleteMany({});
    await Serie.deleteMany({});
    await Temporada.deleteMany({});
    await Episodio.deleteMany({});
    await Progreso.deleteMany({});
    console.log('✅ Base de datos limpiada');
    
    // 1. CREAR USUARIOS
    console.log('\n👤 CREANDO USUARIOS');
    const users = await User.create([
      {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123', // Plaintext password (removed hashed password)
        role: 'user',
        registeredSeries: []
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123', // Plaintext password (removed hashed password)
        role: 'user',
        registeredSeries: []
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123', // Plaintext password (removed hashed password)
        role: 'admin',
        registeredSeries: []
      }
    ]);
    console.log(`✅ ${users.length} usuarios creados`);
    
    // 2. CREAR SERIES
    console.log('\n📺 CREANDO SERIES');
    const seriesData = [
      {
        nombre: 'Breaking Bad',
        sinopsis: 'Un profesor de química con cáncer terminal se convierte en fabricante de metanfetamina para asegurar el futuro de su familia.',
        anioInicio: 2008,
        anioFin: 2013,
        genero: 'Drama, Crimen, Thriller',
        temporadas: []
      },
      {
        nombre: 'Stranger Things',
        sinopsis: 'Cuando un niño desaparece, un pequeño pueblo descubre un misterio que involucra experimentos secretos, fuerzas sobrenaturales y una extraña niña.',
        anioInicio: 2016,
        genero: 'Drama, Fantasía, Terror',
        temporadas: []
      },
      {
        nombre: 'Game of Thrones',
        sinopsis: 'Nobles familias luchan por el control de los Siete Reinos de Westeros.',
        anioInicio: 2011,
        anioFin: 2019,
        genero: 'Drama, Fantasía, Aventura',
        temporadas: []
      },
      {
        nombre: 'The Crown',
        sinopsis: 'Basada en hechos históricos, esta serie dramatiza la vida de la reina Isabel II y los eventos que moldearon la segunda mitad del siglo XX.',
        anioInicio: 2016,
        genero: 'Drama, Historia, Biografía',
        temporadas: []
      },
      {
        nombre: 'The Mandalorian',
        sinopsis: 'Las aventuras de un pistolero solitario en los confines de la galaxia, lejos de la autoridad de la Nueva República.',
        anioInicio: 2019,
        genero: 'Acción, Aventura, Ciencia ficción',
        temporadas: []
      }
    ];
    
    const series = await Serie.create(seriesData);
    console.log(`✅ ${series.length} series creadas`);
    
    // 3. CREAR TEMPORADAS Y EPISODIOS
    console.log('\n🎬 CREANDO TEMPORADAS Y EPISODIOS');
    let totalTemporadas = 0;
    let totalEpisodios = 0;
    
    for (const serie of series) {
      console.log(`\nProcesando serie: ${serie.nombre}`);
      
      // Determinar número de temporadas para esta serie (entre 2 y 5)
      const numTemporadas = Math.floor(Math.random() * 4) + 2;
      console.log(`Creando ${numTemporadas} temporadas`);
      
      const temporadasDeSerie = [];
      
      // Crear temporadas
      for (let t = 1; t <= numTemporadas; t++) {
        const temporada = new Temporada({
          numeroTemporada: t,
          titulo: `Temporada ${t}`,
          descripcion: `Temporada ${t} de ${serie.nombre}`,
          serie: serie._id,
          anio: serie.anioInicio + t - 1,
          episodios: []
        });
        
        await temporada.save();
        temporadasDeSerie.push(temporada);
        totalTemporadas++;
        
        // Crear episodios para esta temporada (entre 8 y 12)
        const numEpisodios = Math.floor(Math.random() * 5) + 8;
        console.log(`  Temporada ${t}: Creando ${numEpisodios} episodios`);
        
        const episodiosDeTemporada = [];
        
        for (let e = 1; e <= numEpisodios; e++) {
          const episodio = new Episodio({
            numeroEpisodio: e,
            nombre: `${serie.nombre} - S${t}E${e}`,
            descripcion: `Episodio ${e} de la temporada ${t} de ${serie.nombre}`,
            temporada: temporada._id,
            duracion: Math.floor(Math.random() * 30) + 30, // 30-59 minutos
            fechaEmision: new Date(temporada.anio, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          });
          
          await episodio.save();
          episodiosDeTemporada.push(episodio);
          totalEpisodios++;
        }
        
        // Actualizar la temporada con sus episodios
        temporada.episodios = episodiosDeTemporada.map(e => e._id);
        await temporada.save();
      }
      
      // Actualizar la serie con sus temporadas
      serie.temporadas = temporadasDeSerie.map(t => t._id);
      await serie.save();
    }
    
    console.log(`✅ ${totalTemporadas} temporadas creadas`);
    console.log(`✅ ${totalEpisodios} episodios creados`);
    
    // 4. CREAR PROGRESOS Y REGISTRAR SERIES
    console.log('\n📊 CREANDO PROGRESOS');
    const progresos = [];
    
    // Obtener usuarios, series y episodios
    const todosLosUsuarios = await User.find({});
    const todasLasSeries = await Serie.find({}).populate({
      path: 'temporadas',
      populate: { path: 'episodios' }
    });
    
    // USUARIO 1: Registrar todas las series, progreso parcial (40%)
    const user1 = todosLosUsuarios[0];
    console.log(`\nUsuario 1 (${user1.username}): Todas las series, progreso parcial`);
    
    // Registrar todas las series
    user1.registeredSeries = todasLasSeries.map(s => s._id);
    await user1.save();
    
    // Marcar progreso (40% de episodios en cada serie)
    for (const serie of todasLasSeries) {
      let totalMarcados = 0;
      
      for (const temporada of serie.temporadas) {
        // Marcar el 40% de los episodios en cada temporada
        const episodiosAMarcar = Math.ceil(temporada.episodios.length * 0.4);
        
        for (let i = 0; i < episodiosAMarcar; i++) {
          const episodio = temporada.episodios[i];
          
          progresos.push({
            usuario: user1._id,
            serie: serie._id,
            episodio: episodio._id,
            visto: true
          });
          
          totalMarcados++;
        }
      }
      
      console.log(`- ${serie.nombre}: ${totalMarcados} episodios marcados como vistos`);
    }
    
    // USUARIO 2: Registrar 2 primeras series, una completa y otra parcial
    if (todosLosUsuarios.length > 1 && todasLasSeries.length >= 2) {
      const user2 = todosLosUsuarios[1];
      const seriesUser2 = todasLasSeries.slice(0, 2);
      
      console.log(`\nUsuario 2 (${user2.username}): 2 series, una completa y otra parcial`);
      
      // Registrar las dos primeras series
      user2.registeredSeries = seriesUser2.map(s => s._id);
      await user2.save();
      
      // Primera serie completa
      const serie1 = seriesUser2[0];
      let marcados1 = 0;
      
      for (const temporada of serie1.temporadas) {
        for (const episodio of temporada.episodios) {
          progresos.push({
            usuario: user2._id,
            serie: serie1._id,
            episodio: episodio._id,
            visto: true
          });
          marcados1++;
        }
      }
      
      console.log(`- ${serie1.nombre}: ${marcados1} episodios marcados como vistos (serie completa)`);
      
      // Segunda serie parcial (50%)
      const serie2 = seriesUser2[1];
      let marcados2 = 0;
      
      for (const temporada of serie2.temporadas) {
        // Solo marcar la primera mitad de los episodios
        const mitad = Math.ceil(temporada.episodios.length / 2);
        
        for (let i = 0; i < mitad; i++) {
          const episodio = temporada.episodios[i];
          
          progresos.push({
            usuario: user2._id,
            serie: serie2._id,
            episodio: episodio._id,
            visto: true
          });
          
          marcados2++;
        }
      }
      
      console.log(`- ${serie2.nombre}: ${marcados2} episodios marcados como vistos (serie parcial)`);
    }
    
    // ADMIN: Todas las series, casi completadas (90%)
    const admin = todosLosUsuarios.find(u => u.role === 'admin');
    if (admin) {
      console.log(`\nAdmin (${admin.username}): Todas las series, casi completadas`);
      
      // Registrar todas las series
      admin.registeredSeries = todasLasSeries.map(s => s._id);
      await admin.save();
      
      // Marcar casi todos los episodios (90%)
      for (const serie of todasLasSeries) {
        let totalMarcados = 0;
        
        for (const temporada of serie.temporadas) {
          // Marcar el 90% de los episodios
          const episodiosAMarcar = Math.ceil(temporada.episodios.length * 0.9);
          
          for (let i = 0; i < episodiosAMarcar; i++) {
            const episodio = temporada.episodios[i];
            
            progresos.push({
              usuario: admin._id,
              serie: serie._id,
              episodio: episodio._id,
              visto: true
            });
            
            totalMarcados++;
          }
        }
        
        console.log(`- ${serie.nombre}: ${totalMarcados} episodios marcados como vistos`);
      }
    }
    
    // Insertar todos los progresos
    if (progresos.length > 0) {
      await Progreso.insertMany(progresos);
      console.log(`\n✅ ${progresos.length} registros de progreso creados`);
    }
    
    // 5. RESUMEN FINAL
    console.log('\n📝 RESUMEN FINAL');
    console.log(`- Usuarios: ${await User.countDocuments()}`);
    console.log(`- Series: ${await Serie.countDocuments()}`);
    console.log(`- Temporadas: ${await Temporada.countDocuments()}`);
    console.log(`- Episodios: ${await Episodio.countDocuments()}`);
    console.log(`- Progresos: ${await Progreso.countDocuments()}`);
    
    console.log('\n✅ TODOS LOS SEEDERS COMPLETADOS EXITOSAMENTE');
    
  } catch (error) {
    console.error('❌ ERROR:', error);
  } finally {
    // Only close the connection if we opened it
    if (connection) {
      // Cerrar conexión a MongoDB
      await mongoose.disconnect();
      console.log('Conexión a MongoDB cerrada');
    }
  }
}

// Check if this file is being run directly
if (require.main === module) {
  // Ejecutar todos los seeders only if file is run directly
  runAllSeeders()
    .then(() => console.log('Proceso finalizado'))
    .catch(err => console.error('Error general:', err));
} else {
  // Export for use in other files
  module.exports = runAllSeeders;
}