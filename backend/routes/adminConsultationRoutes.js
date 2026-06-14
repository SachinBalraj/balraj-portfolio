const express = require('express');
const {
  getConsultations,
  updateStatus,
  deleteConsultation,
} = require('../controllers/adminConsultationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getConsultations);
router.patch('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteConsultation);

module.exports = router;
