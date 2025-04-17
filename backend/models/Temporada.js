const { default: mongoose } = require("mongoose");

const temporadaSchema = new mongoose.Schema({
  numeroTemporada: {
    type: Number,
    required: [true, "El número de temporada es obligatorio"],
  },
  episodios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episodio",
      required: [true, "Los episodios son obligatorios"],
    },
  ],
  serie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Serie",
    required: [true, "La serie es obligatoria"],
  },
}, { timestamps: true });


module.exports = mongoose.model('Temporada', temporadaSchema);