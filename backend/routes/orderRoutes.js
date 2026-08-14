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
import {
  createPayment,
  VNPayCallback,
} from '../controller/paymentController.js';

router.route('/vnpay/callback').get(VNPayCallback);
router.use(protect);

router
  .route('/')
  .post(validate(createOrderSchema), addOrderItems)
  .get(admin, getOrders);

router.route('/mine').get(getMyOrder);

router.route('/:id').get(validateParams(mongoIdParamSchema), getOrderByID);

router
  .route('/:id/pay')
  .put(
    validateParams(mongoIdParamSchema),
    validate(payOrderSchema),
    updateOrderToPaid,
  );

router
  .route('/:id/deliver')
  .put(validateParams(mongoIdParamSchema), updateOrderToDelivered);

router
  .route('/:id/vnpay/create')
  .post(validateParams(mongoIdParamSchema), createPayment);

export default router;
