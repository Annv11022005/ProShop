import Joi from 'joi';

export const createReturnRequestSchema = Joi.object({
  orderId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid order ID format',
      'any.required': 'Order ID is required',
    }),
  type: Joi.string()
    .valid('RETURN_REFUND', 'EXCHANGE')
    .required()
    .messages({
      'any.only': 'Return type must be either RETURN_REFUND or EXCHANGE',
      'any.required': 'Return type is required',
    }),
  reason: Joi.string()
    .valid(
      'DAMAGED_DEFECTIVE',
      'WRONG_ITEM',
      'NOT_AS_DESCRIBED',
      'CHANGE_OF_MIND',
      'OTHER',
    )
    .required()
    .messages({
      'any.only': 'Invalid return reason',
      'any.required': 'Return reason is required',
    }),
  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Please describe the issue with your order',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 1000 characters',
      'any.required': 'Description is required',
    }),
  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .max(5)
    .required()
    .messages({
      'array.min': 'Please provide at least 1 proof photo',
      'array.max': 'You can upload at most 5 proof photos',
      'any.required': 'Proof photos are required',
    }),
  bankInfo: Joi.object({
    bankName: Joi.string().trim().required().messages({
      'string.empty': 'Bank name is required',
      'any.required': 'Bank name is required',
    }),
    accountNumber: Joi.string().trim().required().messages({
      'string.empty': 'Bank account number is required',
      'any.required': 'Bank account number is required',
    }),
    accountHolder: Joi.string().trim().required().messages({
      'string.empty': 'Account holder name is required',
      'any.required': 'Account holder name is required',
    }),
  })
    .when('type', {
      is: 'RETURN_REFUND',
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    })
    .messages({
      'any.required': 'Bank information is required for refund',
    }),
});

export const reviewReturnRequestSchema = Joi.object({
  action: Joi.string().valid('APPROVE', 'REJECT').required().messages({
    'any.only': 'Action must be either APPROVE or REJECT',
    'any.required': 'Review action is required',
  }),
  rejectReason: Joi.string()
    .trim()
    .when('action', {
      is: 'REJECT',
      then: Joi.required().messages({
        'string.empty': 'Rejection reason is required',
        'any.required': 'Rejection reason is required',
      }),
      otherwise: Joi.optional().allow('', null),
    }),
  warehouseAddress: Joi.string()
    .trim()
    .when('action', {
      is: 'APPROVE',
      then: Joi.required().messages({
        'string.empty': 'Return warehouse address is required when approving',
        'any.required': 'Return warehouse address is required when approving',
      }),
      otherwise: Joi.optional().allow('', null),
    }),
  instructions: Joi.string().trim().allow('', null).optional(),
});

export const updateReturnTrackingSchema = Joi.object({
  carrier: Joi.string().trim().required().messages({
    'string.empty': 'Shipping carrier name is required',
    'any.required': 'Shipping carrier name is required',
  }),
  trackingCode: Joi.string().trim().required().messages({
    'string.empty': 'Tracking number is required',
    'any.required': 'Tracking number is required',
  }),
  note: Joi.string().trim().allow('', null).optional(),
});

export const completeReturnRequestSchema = Joi.object({
  restock: Joi.boolean().default(true),
  note: Joi.string().trim().allow('', null).optional(),
});
