const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Login de usuario - simplificado
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Verificar si se proporcionaron email y contraseña
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor proporcione email y contraseña',
      });
    }

    // 2. Verificar si el usuario existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Correo o contraseña incorrectos',
      });
    }

    // 3. Comparar contraseñas directamente (sin encriptación)
    if (user.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Correo o contraseña incorrectos',
      });
    }

    // 4. Crear token usando el método del modelo
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // 5. Enviar respuesta exitosa
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username, // Cambiado de name a username
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

// Middleware de protección simplificado
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