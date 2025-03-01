const Example = require('../models/ExampleModel');

exports.getExamples = async (req, res) => {
    try {
        const examples = await Example.find();
        res.json(examples);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};