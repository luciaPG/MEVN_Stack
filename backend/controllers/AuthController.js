const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
// Removed bcrypt import

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor proporcione nombre de usuario, email y contraseña',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Este correo ya está registrado',
      });
    }

    // Store password in plaintext (no encryption)
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user',
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

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

    // 1. Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor proporcione email y contraseña',
      });
    }

    // 2. Find user by email and include password field for verification
    const user = await User.findOne({ email }).select('+password');
    
    // 3. Check if user exists
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Correo o contraseña incorrectos',
      });
    }

    // 4. Verify password with direct comparison (no encryption)
    let isPasswordValid = false;

    // Plain text password comparison
    isPasswordValid = (password === user.password);

    // 5. If password is not valid, return error
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Correo o contraseña incorrectos',
      });
    }

    // 6. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // 7. Send response with token and user data
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: user._id,
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
        message: 'No está autorizado para acceder a esta ruta',
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario perteneciente a este token ya no existe',
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Token inválido o expirado',
    });
  }
};