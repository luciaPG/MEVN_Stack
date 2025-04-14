const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);



router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});




module.exports = router;