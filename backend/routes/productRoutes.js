import express from 'express';
import {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controller/productController.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validator/productValidator.js';
import { validate, validateParams } from '../middleware/validateMiddleware.js';
import { admin, protect, optionalAuth } from '../middleware/authMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
const router = express.Router();

router
  .route('/')
  .get(optionalAuth, getProducts)
  .post(protect, admin, validate(createProductSchema), createProduct);

router.get('/top', getTopProducts);

router.get('/:slugOrId', optionalAuth, getProductBySlugOrId);

router
  .route('/:id')
  .put(
    protect,
    admin,
    validateParams(mongoIdParamSchema),
    validate(updateProductSchema),
    updateProduct,
  )
  .delete(protect, admin, validateParams(mongoIdParamSchema), deleteProduct);

router
  .route('/:id/reviews')
  .post(protect, validateParams(mongoIdParamSchema), createProductReview);

export default router;
