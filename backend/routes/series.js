const express = require('express');
const router = express.Router();
const SerieController = require('../controllers/SerieController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', SerieController.getAllSeries);
router.get('/:id', SerieController.getSerieById);

// Protected routes requiring authentication
router.post('/', authenticate, SerieController.createSerie);
router.put('/:id', authenticate, SerieController.updateSerie);
router.delete('/:id', authenticate, SerieController.deleteSerie);

// User series management
router.get('/user/:userId', authenticate, SerieController.getSeriesByUserId);
router.post('/register', authenticate, SerieController.registerSeriesToUser);
router.delete('/user/:userId/serie/:serieId', authenticate, SerieController.unregisterSeriesFromUser);

module.exports = router;
