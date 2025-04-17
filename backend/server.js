require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/UserRoutes');
const SerieRoutes = require('./routes/SerieRoutes');
const TemporadaRoutes = require('./routes/TemporadaRoutes');
const EpisodioRoutes = require('./routes/EpisodioRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Backend funcionando');
});


app.use('/api/auth', authRoutes);
app.use('/api/series', SerieRoutes);
app.use('/api/temporadas', TemporadaRoutes);
app.use('/api/episodios', EpisodioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
});