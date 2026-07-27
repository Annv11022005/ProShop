import express from 'express';
import {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controller/productController.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validator/productValidator.js';
import { validate, validateParams } from '../middleware/validateMiddleware.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, validate(createProductSchema), createProduct);

router.get('/:slugOrId', getProductBySlugOrId);

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

export default router;
