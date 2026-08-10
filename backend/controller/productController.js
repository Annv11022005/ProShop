import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../model/productsModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import { normalizeProductInput, presentProduct } from '../utils/productPresenter.js';

// @desc fetch all products
// GET /api/products
// @access public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const queryObj = { ...req.query };
  const excludedFields = [
    'page',
    'sort',
    'limit',
    'fields',
    'pageNumber',
    'keyword',
    'stock',
  ];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filterQuery = JSON.parse(queryStr);

  // Build stock filter on variants array
  let stockFilter = {};
  if (req.query.stock === 'countInStock') {
    stockFilter = { variants: { $elemMatch: { countInStock: { $gt: 0 } } } };
  } else if (req.query.stock === 'countOfStock') {
    stockFilter = { variants: { $not: { $elemMatch: { countInStock: { $gt: 0 } } } } };
  }

  const isAdmin = req.user && req.user.isAdmin;
  const statusFilter = isAdmin ? {} : { status: 'Active' };

  const count = await Product.countDocuments({ ...keyword, ...filterQuery, ...stockFilter, ...statusFilter });

  const features = new APIFeatures(Product.find({ ...keyword, ...stockFilter, ...statusFilter }), req.query)
    .filter()
    .sort()
    .limitFields();

  const products = await features.query
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ products: products.map(presentProduct), page, pages: Math.ceil(count / pageSize) });
});

// @desc fetch a product
// GET /api/products/:slugOrId
// @access public
export const getProductBySlugOrId = asyncHandler(async (req, res) => {
  const isObjectId = req.params.slugOrId.match(/^[0-9a-fA-F]{24}$/);
  const isAdmin = req.user && req.user.isAdmin;

  const product = isObjectId
    ? await Product.findById(req.params.slugOrId)
    : await Product.findOne({ slug: req.params.slugOrId });

  if (product) {
    if (!isAdmin && product.status !== 'Active') {
      res.status(404);
      throw new Error('Resource not found');
    }
    return res.json(presentProduct(product));
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc Get top rated products
// GET /api/products/top
// @access public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json(products.map(presentProduct));
});

// @desc create a product
// POST /api/products
// @access private/admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, subtitle, description, image, brand, category, variants, status } =
    normalizeProductInput(req.body);

  const product = new Product({
    name,
    subtitle,
    user: req.user._id,
    image,
    brand,
    category,
    variants,
    status,
    numberViews: 0,
    description,
  });

  const createdProduct = await product.save();

  res.status(201).json(presentProduct(createdProduct));
});

// @desc update product
// PUT /api/products/:id
// @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, subtitle, description, image, brand, category, variants, status } =
    normalizeProductInput(req.body);

  const product = await Product.findById(req.params.id);

  if (product) {
    if (name !== undefined) product.name = name;
    if (subtitle !== undefined) product.subtitle = subtitle;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (variants !== undefined) product.variants = variants;
    if (status !== undefined) product.status = status;

    const updatedProduct = await product.save();
    res.status(200).json(presentProduct(updatedProduct));
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'product deleted' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc Create a new review
// POST /api/products/:id/reviews
// public
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product Already Reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numberViews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});
