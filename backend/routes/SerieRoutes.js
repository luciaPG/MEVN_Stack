const express = require('express');
const router = express.Router();
const SerieController = require('../controllers/SerieController');
const { validateJWT } = require('../middlewares/validateJWT');

// Public routes - no authentication needed
router.get('/', SerieController.getAllSeries);

// Routes with specific paths should come BEFORE routes with parameters
router.get('/user/:userId', validateJWT, SerieController.getSeriesByUserId);
router.post('/user', validateJWT, SerieController.registerSeriesToUser);
router.delete('/user/:userId/:serieId', validateJWT, SerieController.unregisterSeriesFromUser);

// More generic routes with parameters come LAST
router.get('/:id', validateJWT, SerieController.getSerieById);
router.put('/:id', validateJWT, SerieController.updateSerie);
router.delete('/:id', validateJWT, SerieController.deleteSerie);
router.post('/', validateJWT, SerieController.createSerie);

module.exports = router;