const express = require('express');
const { getExamples } = require('../controllers/ExampleController');

const router = express.Router();

router.get('/', getExamples);

module.exports = router;