const express = require('express');
const {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  reorderPlans,
} = require('../controllers/adminInvestmentPlanController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getPlans);
router.post('/', protect, createPlan);
router.put('/reorder', protect, reorderPlans);
router.put('/:id', protect, updatePlan);
router.delete('/:id', protect, deletePlan);

module.exports = router;
