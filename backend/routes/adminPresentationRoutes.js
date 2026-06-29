const express = require('express');
const {
  getPresentations,
  createPresentation,
  updatePresentation,
  deletePresentation,
  reorderPresentations,
} = require('../controllers/adminPresentationController');
const { protect } = require('../middleware/authMiddleware');
const presentationUpload = require('../middleware/presentationUploadMiddleware');

const router = express.Router();

router.get('/', protect, getPresentations);
router.post('/', protect, presentationUpload.single('presentation'), createPresentation);
router.put('/reorder', protect, reorderPresentations);
router.put('/:id', protect, presentationUpload.single('presentation'), updatePresentation);
router.delete('/:id', protect, deletePresentation);

module.exports = router;
