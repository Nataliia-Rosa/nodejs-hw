import createHttpError from 'http-errors';
import multer from 'multer';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const fileFilter = (req, file, callback) => {
  if (file.mimetype?.startsWith('image/')) {
    callback(null, true);
    return;
  }

  callback(createHttpError(400, 'Only images allowed'));
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

export default upload;
