import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getDashboardSummary,
  getLowStockProducts,
  getOrderStatusBreakdown,
  getRevenue,
  getTopProducts,
} from '../controller/analyticsController.js';

const router = express.Router();

router.use(protect, admin);

router.route('/summary').get(getDashboardSummary);
router.route('/revenue').get(getRevenue);
router.route('/low-stock').get(getLowStockProducts);
router.route('/orders-status').get(getOrderStatusBreakdown);
router.route('/top-products').get(getTopProducts);

export default router;
