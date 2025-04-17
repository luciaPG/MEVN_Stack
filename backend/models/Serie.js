const { default: mongoose } = require("mongoose");

const serieSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre de la serie es obligatorio"],
    trim: true,
  },
  sinopsis: {
    type: String,
    required: [true, "La sinopsis es obligatoria"],
    trim: true,
  },
  genero: {
    type: String,
    required: [true, "El género es obligatorio"],
    trim: true,
  },
  temporada: {
    type: Number,
    ref: "Temporada",
    required: [true, "La temporada es obligatoria"],
  },
}, { timestamps: true });

module.exports = mongoose.model('Serie', serieSchema);