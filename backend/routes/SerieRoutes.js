const express = require("express");
const router = express.Router();

const {
    createSerie,
    getAllSeries,
    getSerieById,
    updateSerie,
    deleteSerie,
} = require("../controllers/SerieController");

router.post("/", createSerie);
router.get("/", getAllSeries);
router.get("/:id", getSerieById);
router.put("/:id", updateSerie);
router.delete("/:id", deleteSerie);

module.exports = router;