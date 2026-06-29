const express = require('express');
const router = express.Router();
const presentationUpload = require('../middleware/presentationUploadMiddleware');
const { uploadPresentation } = require('../controllers/presentationController');

router.post('/upload', presentationUpload.single('presentation'), uploadPresentation);

module.exports = router;
