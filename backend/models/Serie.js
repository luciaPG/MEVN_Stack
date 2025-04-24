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
  temporadas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temporada",
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Serie', serieSchema);