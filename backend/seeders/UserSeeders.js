const mongoose = require('mongoose');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'User1',
    username:'user1',
    email: 'user1@example.com',
    password: '123',
    role: 'user'
  },
  {
    name: 'User2',
    username: 'user2',
    email: 'user2@example.com',
    password: '123',
    role: 'user'
  }
];

const seedUsers = async () => {
  try {
  
    await User.deleteMany({});
    console.log('  Usuarios anteriores borrados');


    const hashedUsers = await Promise.all(
      users.map(async user => ({
        ...user,
      }))
    );

    await User.insertMany(hashedUsers);
    console.log('🌱  Usuarios creados exitosamente:');
    console.log(users.map(u => ({ email: u.email, role: u.role })));
    
    return true;
  } catch (err) {
    console.error('Error al sembrar usuarios:', err.message);
    return false;
  }
};

module.exports = seedUsers;