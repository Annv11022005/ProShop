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
router.route('/unread-count').get(getUnreadNotification);
router.route('/read-all').put(makeAllReadNotification);
router.route('/:id').put(makeReadNotification);

export default router;
