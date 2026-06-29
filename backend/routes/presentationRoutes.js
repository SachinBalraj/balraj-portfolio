const express = require('express');
const { getPresentations } = require('../controllers/presentationController');

const router = express.Router();

router.get('/', getPresentations);

module.exports = router;
