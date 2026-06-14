const express = require('express');
const { getFounder } = require('../controllers/founderController');

const router = express.Router();

router.get('/', getFounder);

module.exports = router;
