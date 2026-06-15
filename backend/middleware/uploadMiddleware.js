const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUpload = (subfolder = 'uploads') => {
  const isVercel = !!process.env.VERCEL;
  const dir = isVercel
    ? path.join('/tmp', 'uploads', subfolder)
    : path.join(__dirname, '..', 'uploads', subfolder);
  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${subfolder}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

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

const upload = createUpload('achievements');
upload.createUpload = createUpload;

module.exports = upload;
