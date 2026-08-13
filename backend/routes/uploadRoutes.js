import express from 'express';
import multer from 'multer';

import { admin, protect } from '../middleware/authMiddleware.js';
import imagekitConfig from '../config/imageKit.js';

const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const fileTypes = /jpg|jpeg|png|webp/;
  const extname = fileTypes.test(
    file.originalname.split('.').pop().toLowerCase(),
  );
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Image only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router
  .route('/')
  .post(protect, admin, upload.single('image'), async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
      }

      const result = await imagekitConfig.imagekit.upload({
        file: req.file.buffer.toString('base64'),
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/proshop/product',
      });

      res.send({
        message: 'Image Uploaded',
        image: result.url,
        fileId: result.fileId,
      });
    } catch (error) {
      next(error);
    }
  });

export default router;
