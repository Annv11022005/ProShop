import asyncHandler from '../middleware/asyncHandler';
import Product from '../model/productsModel.js';
import Order from '../model/orderModel.js';
import { presentProduct } from '../utils/productPresenter.js';

import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../model/orderModel.js';
import User from '../model/userModel.js';

function calcChangePercent(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

// @desc get dashboard summary: revenue, orders, AOV, new customers
// GET /api/v1/analytics/summary?days=30
// @access private/admin
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const rawDays = Number(req.query.days);
  const periodDays =
    Number.isInteger(rawDays) && rawDays > 0 && rawDays <= 365 ? rawDays : 30;

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const currentStart = new Date(now.getTime() - periodDays * dayMs);
  const previousStart = new Date(currentStart.getTime() - periodDays * dayMs);

  const [orderAgg, newCustomersCurrent, newCustomersPrevious] =
    await Promise.all([
      Order.aggregate([
        {
          $match: {
            isPaid: true,
            paidAt: { $gte: previousStart, $lte: now },
          },
        },
        {
          $facet: {
            current: [
              { $match: { paidAt: { $gte: currentStart } } },
              {
                $group: {
                  _id: null,
                  revenue: { $sum: '$totalPrice' },
                  orders: { $sum: 1 },
                },
              },
            ],
            previous: [
              { $match: { paidAt: { $lt: currentStart } } },
              {
                $group: {
                  _id: null,
                  revenue: { $sum: '$totalPrice' },
                  orders: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]),
      User.countDocuments({
        isAdmin: false,
        isVerified: true,
        createdAt: { $gte: currentStart, $lte: now },
      }),
      User.countDocuments({
        isAdmin: false,
        isVerified: true,
        createdAt: { $gte: previousStart, $lt: currentStart },
      }),
    ]);

  const current = orderAgg[0]?.current[0] ?? { revenue: 0, orders: 0 };
  const previous = orderAgg[0]?.previous[0] ?? { revenue: 0, orders: 0 };

  const currentAOV = current.orders > 0 ? current.revenue / current.orders : 0;
  const previousAOV =
    previous.orders > 0 ? previous.revenue / previous.orders : 0;

  res.status(200).json({
    period: `${periodDays}d`,
    revenue: {
      current: Math.round(current.revenue),
      previous: Math.round(previous.revenue),
      changePercent: calcChangePercent(current.revenue, previous.revenue),
    },
    orders: {
      current: current.orders,
      previous: previous.orders,
      changePercent: calcChangePercent(current.orders, previous.orders),
    },
    averageOrderValue: {
      current: Math.round(currentAOV),
      previous: Math.round(previousAOV),
      changePercent: calcChangePercent(currentAOV, previousAOV),
    },
    newCustomers: {
      current: newCustomersCurrent,
      previous: newCustomersPrevious,
      changePercent: calcChangePercent(
        newCustomersCurrent,
        newCustomersPrevious,
      ),
    },
  });
});

// @desc get revenue
// GET /api/v1/dashboard/revenue?period=7d|30d|12m
// private/admin
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

const RANGE_CONFIG = {
  '7d': { amount: 7, unit: 'day' },
  '30d': { amount: 30, unit: 'day' },
  '12m': { amount: 12, unit: 'month' },
};

// Đọc "hôm nay" theo giờ VN, không phụ thuộc timezone của server
function vnToday() {
  const shifted = new Date(Date.now() + VN_OFFSET_MS);
  return {
    y: shifted.getUTCFullYear(),
    m: shifted.getUTCMonth(),
    d: shifted.getUTCDate(),
  };
}

function vnToUtc(y, m, d) {
  return new Date(Date.UTC(y, m, d) - VN_OFFSET_MS);
}

export const getRevenue = asyncHandler(async (req, res) => {
  const period = RANGE_CONFIG[req.query.period] ? req.query.period : '7d';
  const { amount, unit } = RANGE_CONFIG[period];
  const today = vnToday();

  const dateMap = new Map();
  let startDate;

  if (unit === 'day') {
    startDate = vnToUtc(today.y, today.m, today.d - (amount - 1));
    for (let i = 0; i < amount; i++) {
      const dt = new Date(
        Date.UTC(today.y, today.m, today.d - (amount - 1) + i),
      );
      const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
      dateMap.set(key, `${dt.getUTCMonth() + 1}/${dt.getUTCDate()}`);
    }
  } else {
    // Luôn tính theo ngày 1 của tháng nên không bao giờ tràn tháng
    startDate = vnToUtc(today.y, today.m - (amount - 1), 1);
    for (let i = 0; i < amount; i++) {
      const dt = new Date(Date.UTC(today.y, today.m - (amount - 1) + i, 1));
      const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`;
      dateMap.set(key, `${dt.getUTCMonth() + 1}/${dt.getUTCFullYear()}`);
    }
  }

  const now = new Date();

  const result = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: startDate, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: unit === 'month' ? '%Y-%m' : '%Y-%m-%d',
            date: '$paidAt',
            timezone: 'Asia/Ho_Chi_Minh',
          },
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const revenueMap = new Map(result.map((r) => [r._id, r.revenue]));
  const ordersMap = new Map(result.map((r) => [r._id, r.orders]));
  const keys = Array.from(dateMap.keys());

  res.status(200).json({
    period,
    labels: keys.map((k) => dateMap.get(k)),
    revenue: keys.map((k) => revenueMap.get(k) || 0),
    orders: keys.map((k) => ordersMap.get(k) || 0),
  });
});

// @desc get order status breakdown
// GET /api/v1/dashboard/orders-status
// private/admin
const ORDER_STATUSES = [
  'Cancelled',
  'PaidAndDelivered',
  'PaidNotDelivered',
  'Unpaid',
];

export const getOrderStatusBreakdown = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              {
                case: { $eq: ['$isCancelled', true] },
                then: 'Cancelled',
              },
              {
                case: {
                  $and: [
                    { $eq: ['$isPaid', true] },
                    { $eq: ['$isDelivered', true] },
                  ],
                },
                then: 'PaidAndDelivered',
              },
              {
                case: {
                  $and: [
                    { $eq: ['$isPaid', true] },
                    { $eq: ['$isDelivered', false] },
                  ],
                },
                then: 'PaidNotDelivered',
              },
              {
                case: { $eq: ['$isPaid', false] },
                then: 'Unpaid',
              },
            ],
            default: 'Other',
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const countByStatus = new Map(orders.map((r) => [r._id, r.count]));

  const breakdown = ORDER_STATUSES.map((status) => ({
    status,
    count: countByStatus.get(status) || 0,
  }));

  res.status(200).json(breakdown);
});

// @desc get low stock
// GET /api/v1/dashboard/low-stock
// private/admin
// @desc get products with low stock variants
// GET /api/v1/analytics/low-stock?threshold=5
// @access private/admin
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = 5;

  const products = await Product.find({
    variants: {
      $elemMatch: { countInStock: { $lte: threshold } },
    },
  }).select('name slug image variants');

  const lowStockItems = products.flatMap((product) =>
    product.variants
      .filter((v) => v.countInStock <= threshold)
      .map((v) => ({
        productId: product._id,
        productName: product.name,
        slug: product.slug,
        image: product.image?.[0]?.url || '',
        variantId: v._id,
        sku: v.sku,
        color: v.color,
        size: v.size,
        countInStock: v.countInStock,
      })),
  );

  res.status(200).json(lowStockItems);
});
