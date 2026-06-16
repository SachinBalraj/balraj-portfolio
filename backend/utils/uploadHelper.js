const path = require('path');
const Upload = require('../models/Upload');

const saveFileToDb = async (file, subfolder) => {
  if (!file) return '';
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `${subfolder}-${uniqueSuffix}${path.extname(file.originalname)}`;
  
  await Upload.create({
    filename,
    contentType: file.mimetype,
    data: file.buffer,
  });

  return `/uploads/${subfolder}/${filename}`;
};

const deleteFileFromDb = async (fileUrl) => {
  if (!fileUrl) return;
  const filename = path.basename(fileUrl);
  try {
    await Upload.deleteOne({ filename });
  } catch {}
};

module.exports = { saveFileToDb, deleteFileFromDb };
