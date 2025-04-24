// Rutas de progreso (progresoRoutes.js)
const express = require('express');
const router = express.Router();
const progresoController = require('../controllers/ProgresoController');
const authController = require('../controllers/AuthController');

// Proteger todas las rutas
router.use(authController.protect);

// Marcar episodio como visto/no visto
router.post('/', progresoController.createProgreso);
router.put('/:id', progresoController.updateProgreso);

// Obtener progreso
router.get('/usuario/:id', progresoController.getProgresoByUserId);
router.get('/episodio/:episodioId', progresoController.getProgresoByEpisodioId);

// Series routes - make sure parameter names are consistent
router.get('/series/:userId', progresoController.getSeriesWithProgress);
router.get('/usuario/:userId/series', progresoController.getSeriesByUser); // Updated parameter to userId

// Additional routes
router.get('/usuario/:userId/series-registradas', progresoController.getUserSeries);
router.get('/usuario/:userId/serie/:serieId/progreso', progresoController.getSerieProgress);

// Eliminar progreso
router.delete('/:id', progresoController.deleteProgreso);

module.exports = router;