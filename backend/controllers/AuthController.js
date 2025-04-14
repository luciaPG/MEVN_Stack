const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


// Función para crear y enviar token
const createSendToken = (user, statusCode, res) => {
  const token = user.generateAuthToken();
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Registro de usuario
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validación adicional
    if (role && !['user', 'admin', 'editor'].includes(role)) {
      throw new Error('Rol de usuario no válido', 400);
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

// Login de usuario
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
        message: `Correo o contraseña incorrectos`,
      });
    }

    // 3. Comparar contraseñas directamente (sin encriptación)
    if (user.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: `Correo o contraseña incorrectos 2, ${user.password}`,
      });
    }

    // 4. Crear token usando el método del modelo
    const token = user.generateAuthToken();

    // 5. Enviar respuesta exitosa
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
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
// Middleware de protección
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // 1) Obtener el token y verificar si está ahí
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error('No está autorizado para acceder a esta ruta', 401);
    }

    // 2) Verificar token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Verificar si el usuario aún existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error('El usuario perteneciente a este token ya no existe', 401);
    }

    // 4) Verificar si el usuario cambió la contraseña después de que se emitió el token
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error('El usuario cambió recientemente la contraseña. Por favor inicie sesión nuevamente', 401);
    }

    // CONCEDE ACCESO A LA RUTA PROTEGIDA
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Restringir rutas por roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Error('No tiene permiso para realizar esta acción', 403);
    }
    next();
  };
};