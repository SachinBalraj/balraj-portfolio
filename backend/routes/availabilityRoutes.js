const express = require('express');
const {
  getAvailabilityByDate,
  getMonthAvailability,
} = require('../controllers/availabilityController');

const router = express.Router();

router.get('/:date', getAvailabilityByDate);
router.get('/month/:year/:month', getMonthAvailability);

module.exports = router;
