const multer = require('multer');
const path = require('path');

const ALLOWED_EXTENSIONS = /\.(ppt|pptx|pdf|doc|docx|xls|xlsx|txt|rtf|odt|ods|odp|zip|rar|jpg|jpeg|png|gif|webp|mp4|mov|avi|mp3|wav)$/i;
const MAX_SIZE = 100 * 1024 * 1024;

const createPresentationUpload = () => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (ALLOWED_EXTENSIONS.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload a supported presentation, document, media, or archive file.'), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE },
  });
};

const presentationUpload = createPresentationUpload();
presentationUpload.createPresentationUpload = createPresentationUpload;

module.exports = presentationUpload;
