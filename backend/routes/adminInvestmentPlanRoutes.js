const express = require('express');
const {
  getPlans,
  createPlan,
  updatePlan,
  uploadPlanFile,
  deletePlanFile,
  deletePlan,
  reorderPlans,
} = require('../controllers/adminInvestmentPlanController');
const { protect } = require('../middleware/authMiddleware');
const investmentPlanUpload = require('../middleware/investmentPlanUploadMiddleware');

const router = express.Router();

router.get('/', protect, getPlans);
router.post('/', protect, createPlan);
router.put('/reorder', protect, reorderPlans);
router.put('/:id', protect, updatePlan);
router.post('/:id/upload', protect, investmentPlanUpload.single('planFile'), uploadPlanFile);
router.delete('/:id/file', protect, deletePlanFile);
router.delete('/:id', protect, deletePlan);

module.exports = router;
