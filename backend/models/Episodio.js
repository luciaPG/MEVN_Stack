const { default: mongoose } = require("mongoose");

const episodioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del episodio es obligatorio"],
    trim: true,
  },
    sinopsis: {
        type: String,
        required: false,
        trim: true,
    },
  temporada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Temporada",
    required: [true, "La temporada es obligatoria"],
  },
  numeroEpisodio: {
    type: Number,
    required: [true, "El número de episodio es obligatorio"],
  },
  fechaEstreno: {
    type: Date,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Episodio', episodioSchema);