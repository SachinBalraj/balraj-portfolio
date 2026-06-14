const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} = require('../controllers/adminTeamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getCategories);
router.post('/', protect, createCategory);
router.put('/reorder', protect, reorderCategories);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
