const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.validateJWT = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No está autorizado para acceder a esta ruta'
      });
    }

    // Verify token - use same secret as in login
    const jwtSecret = process.env.JWT_SECRET || 'your_development_jwt_secret';
    
    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      // Find user
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'El usuario perteneciente a este token ya no existe'
        });
      }
      
      // Add user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({
        status: 'fail',
        message: 'Token inválido o expirado',
        error: jwtError.message
      });
    }
  } catch (err) {
    console.error('validateJWT error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Error al validar el token',
      error: err.message
    });
  }
};