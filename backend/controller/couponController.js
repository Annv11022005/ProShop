import asyncHandler from '../middleware/asyncHandler.js';
import Coupon from '../model/couponModel.js';
import APIFeatures from '../utils/apiFeatures.js';

// @desc Get all coupon
// GET /api/coupons
// @access public
export const getAllCoupon = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;

  const features = new APIFeatures(
    Coupon.find({ isHidden: false }),
    req.query,
  ).filter();

  const count = await Coupon.countDocuments(features.query.getFilter());

  const coupons = await features.query
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.status(200).json({ coupons, page, pages: Math.ceil(count / pageSize) });
});

// @desc get all Category
// GET /api/coupons/category
// @access public
export const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Coupon.distinct('category', { isHidden: false });

  res.status(200).json(categories);
});

// @desc get coupon by Id
// GET /api/v1/coupon/:id
// @access private/admin
export const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    res.status(200).json(coupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc Get coupon by code
// GET /api/coupons/code
// @access public
export const getCouponByCode = asyncHandler(async (req, res) => {
  const { code } = req.query;
  const coupon = await Coupon.findOne({ code });

  if (coupon) {
    res.status(200).json(coupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc update hidden coupon
// PUT /api/coupons/:id/toggle
// @access private/admin
export const toggleCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    coupon.isHidden = !coupon.isHidden;

    const updateCoupon = await coupon.save();

    res.status(200).json(updateCoupon);
  } else {
    res.status(404);
    throw new Error('coupon not found');
  }
});

// @desc create coupon
// POST /api/coupons
// @access private/admin
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    category,
    title,
    subtitle,
    description,
    badge,
    discountType,
    discountValue,
    minSpend,
    usageLimit,
    expiry,
    code,
  } = req.body;

  const normalizedCode = code?.trim().toUpperCase();

  const existingCoupon = await Coupon.findOne({ code: normalizedCode });

  if (existingCoupon) {
    res.status(400);
    throw new Error(`Mã coupon "${normalizedCode}" đã tồn tại`);
  }

  const newCoupon = new Coupon({
    category: category,
    title: title,
    subtitle: subtitle,
    description: description,
    badge: badge,
    discountType: discountType,
    discountValue: discountValue,
    minSpend: minSpend,
    usageLimit: usageLimit,
    expiry: expiry,
    code: normalizedCode,
  });

  try {
    const createdCoupon = await newCoupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error(`Mã coupon "${normalizedCode}" đã tồn tại`);
    }
    throw error;
  }
});

// @desc update coupon
// PUT /api/coupons/:id
// @access private/admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  const {
    category,
    title,
    subtitle,
    description,
    badge,
    discountType,
    discountValue,
    minSpend,
    usageLimit,
    expiry,
    code,
  } = req.body;

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  if (code && code.toUpperCase() !== coupon.code) {
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      res.status(400);
      throw new Error(`Mã coupon "${code.toUpperCase()}" đã tồn tại`);
    }
  }

  coupon.category = category || coupon.category;
  coupon.title = title || coupon.title;
  coupon.subtitle = subtitle || coupon.subtitle;
  coupon.description = description || coupon.description;
  coupon.badge = badge || coupon.badge;
  coupon.discountType = discountType || coupon.discountType;
  coupon.discountValue = discountValue ?? coupon.discountValue;
  coupon.minSpend = minSpend ?? coupon.minSpend;
  coupon.usageLimit = usageLimit ?? coupon.usageLimit;
  coupon.expiry = expiry || coupon.expiry;
  coupon.code = code ? code.toUpperCase() : coupon.code;

  const updatedCoupon = await coupon.save();
  res.status(200).json(updatedCoupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await coupon.deleteOne();
    res.status(200).json({ message: 'coupon deleted' });
  } else {
    res.status(400);
    throw new Error('Coupon not found');
  }
});
