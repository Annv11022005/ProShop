import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateParams } from '../middleware/validateMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
import {
  createCoupon,
  deleteCoupon,
  getAllCategory,
  getAllCoupon,
  getCouponById,
  toggleCoupon,
  updateCoupon,
} from '../controller/couponController.js';
const router = express.Router();

router.route('/').get(getAllCoupon).post(admin, createCoupon);

router.route('/category').get(getAllCategory);

router
  .route('/:id')
  .get(validateParams(mongoIdParamSchema), getCouponById)
  .put(admin, validateParams(mongoIdParamSchema), updateCoupon)
  .delete(admin, validateParams(mongoIdParamSchema), deleteCoupon);

router
  .route('/:id/toggle')
  .put(admin, validateParams(mongoIdParamSchema), toggleCoupon);

export default router;
