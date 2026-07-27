import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../model/productsModel.js';

// @desc fetch all products
// GET /api/products
// @access public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc fetch a product
// GET /api/products/:slugOrId
// @access public
export const getProductBySlugOrId = asyncHandler(async (req, res) => {
  const isObjectId = req.params.slugOrId.match(/^[0-9a-fA-F]{24}$/);
  
  const product = isObjectId
    ? await Product.findById(req.params.slugOrId)
    : await Product.findOne({ slug: req.params.slugOrId });

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc create a product
// POST /api/products
// @access private/admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = new Product({
    name: name,
    price: price,
    user: req.user._id,
    image: image,
    brand: brand,
    category: category,
    countInStock: countInStock,
    numberViews: 0,
    description: description,
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc update product
// PUT /api/products/:id
// @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Resource not fount');
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
