const express = require('express');
const {
  getAdminAvailabilityByDate,
  updateDateAvailability,
  bulkSetAvailability,
} = require('../controllers/adminAvailabilityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:date', protect, getAdminAvailabilityByDate);
router.put('/:date', protect, updateDateAvailability);
router.put('/:date/bulk', protect, bulkSetAvailability);

module.exports = router;
