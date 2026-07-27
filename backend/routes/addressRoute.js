import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddressDefault,
  updateAddress,
  updateAddressDefault,
} from '../controller/addressController.js';
import { validateParams } from '../middleware/validateMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
const router = express.Router();

router.route('/').get(protect, getAddress).post(protect, createAddress);

router.route('/default').get(protect, getAddressDefault);

router
  .route('/:id/default')
  .put(protect, validateParams(mongoIdParamSchema), updateAddressDefault);

router
  .route('/:id')
  .delete(protect, validateParams(mongoIdParamSchema), deleteAddress)
  .put(protect, validateParams(mongoIdParamSchema), updateAddress);

export default router;
