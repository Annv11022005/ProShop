import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../model/productsModel.js';

// @desc fetch all products
// GET /api/products
// @access public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc fetch a products
// GET /api/products/:id
// @access public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});
