const multer = require('multer');
const path = require('path');

const createUpload = () => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and WEBP files are allowed'), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
};

const upload = createUpload();
upload.createUpload = createUpload;

module.exports = upload;
