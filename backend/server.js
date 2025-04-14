require('dotenv').config(); // Añade esto AL PRINCIPIO del archivo

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/UserRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Conexión a MongoDB con variables de entorno
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

app.use('/api/auth', authRoutes);

// Puerto desde variables de entorno
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
});