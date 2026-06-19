const express = require('express');
const { updateFounder } = require('../controllers/founderController');
const { protect } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const upload = uploadMiddleware.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);

const router = express.Router();

router.put('/', protect, upload, updateFounder);

module.exports = router;
