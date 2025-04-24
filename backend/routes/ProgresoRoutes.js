const express = require("express");
const router = express.Router();
const { validateJWT } = require('../middlewares/validateJWT');

const {
    createProgreso,
    getProgresoByUserId,
    getProgresoByEpisodioId,
    updateProgreso,
    deleteProgreso,
} = require("../controllers/ProgresoController");

// Apply middleware to all routes - progress requires authentication
router.use(validateJWT);

// Progress routes
router.post("/", createProgreso);
router.get("/usuario/:id", getProgresoByUserId);
router.get("/episodio/:id", getProgresoByEpisodioId);
router.put("/:id", updateProgreso);
router.delete("/:id", deleteProgreso);

module.exports = router;