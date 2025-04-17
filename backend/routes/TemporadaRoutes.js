const express = require("express");
const router = express.Router();

const {
    createTemporada,
    getAllTemporadas,
    getTemporadaById,
    updateTemporada,
    deleteTemporada,
    getTemporadasBySerieId,
} = require("../controllers/TemporadaController");

router.post("/", createTemporada);
router.get("/", getAllTemporadas);
router.get("/:id", getTemporadaById);
router.put("/:id", updateTemporada);
router.delete("/:id", deleteTemporada);
router.get("/serie/:serieId", getTemporadasBySerieId);


module.exports = router;