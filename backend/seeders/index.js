require('dotenv').config();
const mongoose = require('mongoose');
const seedUsers = require('./UserSeeders');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/MVN_stack';

const runSeeders = async () => {
  try {
   
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🔌 Conectado a MongoDB para seeders');

   
    await seedUsers();

    await mongoose.disconnect();
    console.log('Seeders completados');
    process.exit(0);
  } catch (err) {
    console.error('Error en los seeders:', err);
    process.exit(1);
  }
};

runSeeders();