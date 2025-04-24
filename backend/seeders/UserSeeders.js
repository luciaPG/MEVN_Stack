const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const users = [
  {
    username: 'user1',
    email: 'user1@example.com',
    password: '123',
    role: 'user'
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    password: '123',
    role: 'user'
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

const seedUsers = async () => {
  try {
    // Borrar usuarios existentes
    await User.deleteMany({});
    console.log('  Usuarios anteriores borrados');

    // Crear hash de las contraseñas
    const hashedUsers = await Promise.all(
      users.map(async user => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        return {
          ...user,
          password: hashedPassword,
          // Inicializar registeredSeries como un array vacío
          registeredSeries: []
        };
      })
    );

    // Insertar usuarios con contraseñas hasheadas
    const createdUsers = await User.insertMany(hashedUsers);
    
    console.log('🌱 Usuarios creados exitosamente:');
    console.log(createdUsers.map(u => ({ 
      id: u._id,
      username: u.username, 
      email: u.email, 
      role: u.role 
    })));
    
    return createdUsers;
  } catch (err) {
    console.error('Error al sembrar usuarios:', err.message);
    return [];
  }
};

module.exports = seedUsers;