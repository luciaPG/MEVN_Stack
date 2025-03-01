const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const exampleRoutes = require('./routes/exampleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mevndb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Rutas
app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use('/api/examples', exampleRoutes);