const express = require("express");
const router = express.Router();

const {
    createEpisodio,
    getAllEpisodios,
    getEpisodioById,
    updateEpisodio,
    deleteEpisodio,
    getEpisodiosByTemporadaId,
} = require("../controllers/EpisodioController");

router.post("/", createEpisodio);
router.get("/", getAllEpisodios);
router.get("/:id", getEpisodioById);
router.put("/:id", updateEpisodio);
router.delete("/:id", deleteEpisodio);
router.get("/temporada/:temporadaId", getEpisodiosByTemporadaId);

module.exports = router;