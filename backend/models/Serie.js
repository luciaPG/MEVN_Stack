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
  ]
}, { timestamps: true });

// Añadir consulta virtual para obtener usuarios que tienen esta serie
serieSchema.virtual('usuarios', {
  ref: 'User',
  localField: '_id',
  foreignField: 'registeredSeries'
});

// Añadir consulta virtual para obtener todos los progresos relacionados con esta serie
serieSchema.virtual('progresos', {
  ref: 'Progreso',
  localField: '_id',
  foreignField: 'serie'
});

module.exports = mongoose.model('Serie', serieSchema);