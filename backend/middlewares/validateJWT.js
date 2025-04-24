const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateJWT = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;
    
    if (!token) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token - user not found'
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Validation Error:', error);
    
    return res.status(401).json({
      message: 'Authentication error'
    });
  }
};

module.exports = { validateJWT }; 