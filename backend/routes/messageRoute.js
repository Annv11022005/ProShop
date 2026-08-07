import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  getChatUser,
  getMessages,
  getUserSeller,
  sendMessage,
} from '../controller/messagesController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getUserSeller);

router.route('/users').get(admin, getChatUser);

router.route('/:id').get(getMessages);

router.route('/send/:id').post(upload.single('image'), sendMessage);

export default router;
