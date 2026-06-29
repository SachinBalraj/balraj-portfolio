const path = require('path');
const Upload = require('../models/Upload');
const { saveFileToDb } = require('../utils/uploadHelper');

const uploadPresentation = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = await saveFileToDb(req.file, 'presentations');

    res.status(200).json({
      success: true,
      message: 'Presentation uploaded successfully',
      data: {
        url: fileUrl,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadPresentation };
