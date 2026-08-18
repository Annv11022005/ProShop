import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateParams } from '../middleware/validateMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
import {
  getDashboardSummary,
  getLowStockProduct,
  getOrderStatusBreakdown,
  getRevenue,
} from '../controller/analyticsController.js';

const router = express.Router();

router.use(protect, admin);

router.route('/summary').get(getDashboardSummary);
router.route('/revenue').get(getRevenue);
router.route('/low-stock').get(getLowStockProduct);
router.route('/orders-status').get(getOrderStatusBreakdown);

export default router;
