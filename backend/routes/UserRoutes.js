const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.use(protect); // Todas las rutas después de esta línea estarán protegidas

router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// Rutas solo para admin
router.use(restrictTo('admin'));

router.get('/admin-only', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Esta es una ruta solo para administradores'
  });
});

module.exports = router;