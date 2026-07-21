import express from 'express';
const router = express.Router();

import {
  addOrderItems,
  getMyOrder,
  getOrderByID,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controller/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);

router.route('/mine').get(protect, getMyOrder);
router.route('/:id').get(protect, getOrderByID);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, updateOrderToDelivered);

export default router;
