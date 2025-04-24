const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { validateJWT } = require('../middlewares/validateJWT');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Add a test endpoint to check login
router.get('/test-login', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Test login endpoint working',
    testCredentials: {
      email: 'user1@example.com',
      password: 'password123'
    }
  });
});

router.get('/me', validateJWT, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router;