const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    // Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor proporcione nombre de usuario, email y contraseña',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Las contraseñas no coinciden',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Este correo ya está registrado',
      });
    }

    // Crear nuevo usuario
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user', // Rol predeterminado
    });

    // Generar token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Enviar respuesta
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor proporcione email y contraseña',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Correo o contraseña incorrectos',
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Correo o contraseña incorrectos',
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor',
      error: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No está autorizado para acceder a esta ruta'
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario perteneciente a este token ya no existe'
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Token inválido o expirado'
    });
  }
};