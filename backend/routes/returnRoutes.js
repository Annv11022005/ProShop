import express from 'express';
import {
  createReturnRequest,
  getReturnRequestByOrder,
  getReturnRequestById,
  getMyReturnRequests,
  getAllReturnRequests,
  reviewReturnRequest,
  updateReturnTracking,
  markReturnReceived,
  completeReturnRequest,
  cancelReturnRequest,
} from '../controller/returnController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate, validateParams } from '../middleware/validateMiddleware.js';
import { mongoIdParamSchema } from '../validator/commonValidator.js';
import {
  createReturnRequestSchema,
  reviewReturnRequestSchema,
  updateReturnTrackingSchema,
  completeReturnRequestSchema,
} from '../validator/returnValidator.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(validate(createReturnRequestSchema), createReturnRequest)
  .get(admin, getAllReturnRequests);

router.route('/mine').get(getMyReturnRequests);

router
  .route('/order/:orderId')
  .get(getReturnRequestByOrder);

router
  .route('/:id')
  .get(validateParams(mongoIdParamSchema), getReturnRequestById);

router
  .route('/:id/review')
  .put(
    admin,
    validateParams(mongoIdParamSchema),
    validate(reviewReturnRequestSchema),
    reviewReturnRequest,
  );

router
  .route('/:id/tracking')
  .put(
    validateParams(mongoIdParamSchema),
    validate(updateReturnTrackingSchema),
    updateReturnTracking,
  );

router
  .route('/:id/receive')
  .put(admin, validateParams(mongoIdParamSchema), markReturnReceived);

router
  .route('/:id/complete')
  .put(
    admin,
    validateParams(mongoIdParamSchema),
    validate(completeReturnRequestSchema),
    completeReturnRequest,
  );

router
  .route('/:id/cancel')
  .put(validateParams(mongoIdParamSchema), cancelReturnRequest);

export default router;
