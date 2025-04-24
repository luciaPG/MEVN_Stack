const mongoose = require('mongoose');

const progresoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Serie',
    required: true
  },
  episodio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episodio',
    required: true
  },
  visto: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  // Especifica el nombre exacto de la colección para evitar problemas
  collection: 'progresos'
});

module.exports = mongoose.model('Progreso', progresoSchema);