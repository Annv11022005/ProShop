import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddressDefault,
  getSellerAddress,
  updateAddress,
  updateAddressDefault,
} from '../controller/addressController.js';
import { validateParams } from '../middleware/validateMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
const router = express.Router();

router.route('/seller').get(getSellerAddress);

router.use(protect);

router.route('/').get(getAddress).post(createAddress);


router.route('/default').get(getAddressDefault);

router
  .route('/:id/default')
  .put(validateParams(mongoIdParamSchema), updateAddressDefault);

router
  .route('/:id')
  .delete(validateParams(mongoIdParamSchema), deleteAddress)
  .put(validateParams(mongoIdParamSchema), updateAddress);

export default router;
