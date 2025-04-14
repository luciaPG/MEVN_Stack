const User = require('../models/UserModel');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await User.create({ email, password, name });

    user.password = undefined;
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Credenciales incorrectas');
    }
    

    user.password = undefined;
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message
    });
  }
};