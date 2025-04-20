const express = require("express");
const router = express.Router();

const {
    createProgreso,
    getProgresoByUserId,
    getProgresoByEpisodioId,
    updateProgreso,
    deleteProgreso,
} = require("../controllers/ProgresoController");

router.post("/", createProgreso);
router.get("/usuario/:id", getProgresoByUserId);
router.get("/episodio/:id", getProgresoByEpisodioId);
router.put("/:id", updateProgreso);
router.delete("/:id", deleteProgreso);

module.exports = router;