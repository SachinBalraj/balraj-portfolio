const express = require('express');
const { getAllPlans } = require('../controllers/investmentPlanController');

const router = express.Router();

router.get('/', getAllPlans);

module.exports = router;
