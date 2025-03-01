const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema({
    name: String,
    description: String,
});

module.exports = mongoose.model('Example', ExampleSchema);