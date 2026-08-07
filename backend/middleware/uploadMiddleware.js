import multer from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');

    if (!isImage) {
      cb(new Error('Only image uploads are allowed'));
      return;
    }

    cb(null, true);
  },
});
