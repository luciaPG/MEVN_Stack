const { default: mongoose } = require("mongoose");

const progresoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El usuario es obligatorio"],
    },
    episodio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episodio",
        required: [true, "El episodio es obligatorio"],
    },
    visto: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Progreso', progresoSchema);