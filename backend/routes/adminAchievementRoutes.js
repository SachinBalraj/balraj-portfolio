const express = require('express');
const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  reorderAchievements,
} = require('../controllers/adminAchievementController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', protect, getAchievements);
router.post('/', protect, upload.single('image'), createAchievement);
router.put('/reorder', protect, reorderAchievements);
router.put('/:id', protect, upload.single('image'), updateAchievement);
router.delete('/:id', protect, deleteAchievement);

module.exports = router;
