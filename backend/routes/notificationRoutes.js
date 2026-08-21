import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  getUnreadNotification,
  makeAllReadNotification,
  makeReadNotification,
} from '../controller/notificationController.js';
const router = express.Router();

router.use(protect);

router.route('/').get(getNotifications);

router.route('/:id').put(makeReadNotification);

router.route('/read-all').get(makeAllReadNotification);

router.route('/unread-count').get(getUnreadNotification);

export default router;
