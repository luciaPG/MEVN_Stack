require('dotenv').config();
const mongoose = require('mongoose');
const seedUsers = require('./UserSeeders');
const seedSeries = require('./SerieSeeders');
const seedTemporadas = require('./TemporadaSeeders');
const seedEpisodios = require('./EpisodioSeeders');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nombre_db';

const runSeeders = async () => {
  try {
   
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🔌 Conectado a MongoDB para seeders');

   
    await seedUsers();
    await seedSeries();
    await seedTemporadas();
    await seedEpisodios();

    await mongoose.disconnect();
    console.log('Seeders completados');
    process.exit(0);
  } catch (err) {
    console.error('Error en los seeders:', err);
    process.exit(1);
  }
};

runSeeders();