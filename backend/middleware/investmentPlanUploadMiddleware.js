const multer = require('multer');
const path = require('path');

const ALLOWED_EXTENSIONS = /\.(pdf|ppt|pptx|doc|docx|xls|xlsx|txt|rtf|odt|ods|odp|zip|rar|jpg|jpeg|png|webp|mp4|mov|mp3|wav)$/i;
const MAX_SIZE = 100 * 1024 * 1024;

const createInvestmentPlanUpload = () => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (ALLOWED_EXTENSIONS.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE },
  });
};

const investmentPlanUpload = createInvestmentPlanUpload();
investmentPlanUpload.createInvestmentPlanUpload = createInvestmentPlanUpload;

module.exports = investmentPlanUpload;
