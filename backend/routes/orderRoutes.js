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
import { validate, validateParams } from '../middleware/validateMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
import {
  createOrderSchema,
  payOrderSchema,
} from '../validator/orderValidator.js';

router
  .route('/')
  .post(protect, validate(createOrderSchema), addOrderItems)
  .get(protect, admin, getOrders);

router.route('/mine').get(protect, getMyOrder);

router
  .route('/:id')
  .get(protect, validateParams(mongoIdParamSchema), getOrderByID);

router
  .route('/:id/pay')
  .put(
    protect,
    validateParams(mongoIdParamSchema),
    validate(payOrderSchema),
    updateOrderToPaid,
  );

router
  .route('/:id/deliver')
  .put(protect, validateParams(mongoIdParamSchema), updateOrderToDelivered);

export default router;
