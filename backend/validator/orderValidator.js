import Joi from 'joi';

// Sub-schema: each item in the order
const orderItemSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required',
  }),
  qty: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
  image: Joi.string().required().messages({
    'string.empty': 'Product image is required',
    'any.required': 'Product image is required',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be greater than or equal to 0',
    'any.required': 'Price is required',
  }),
  _id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid product ID format',
      'any.required': 'Product ID is required',
    }),
  variantId: Joi.string().allow(null, '').optional(),
  sku: Joi.string().allow(null, '').optional(),
  color: Joi.string().allow(null, '').optional(),
  size: Joi.string().allow(null, '').optional(),
}).unknown(true);

// Sub-schema: payment result (returned by PayPal/Stripe/VNPay)
const paymentResultSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Payment ID is required',
    'any.required': 'Payment ID is required',
  }),
  status: Joi.string().required().messages({
    'string.empty': 'Payment status is required',
    'any.required': 'Payment status is required',
  }),
  update_time: Joi.string().required().messages({
    'string.empty': 'Payment update time is required',
    'any.required': 'Payment update time is required',
  }),
  email_address: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Payer email address is required',
      'string.email': 'Invalid payer email address',
      'any.required': 'Payer email address is required',
    }),
});

// Validate body when creating a new order: POST /api/orders
export const createOrderSchema = Joi.object({
  orderItems: Joi.array().items(orderItemSchema).min(1).required().messages({
    'array.min': 'Order must contain at least 1 item',
    'any.required': 'Order items are required',
  }),
  addressId: Joi.string().required().messages({
    'string.empty': 'Shipping address ID is required',
    'any.required': 'Shipping address ID is required',
  }),
  paymentMethod: Joi.string().trim().required().messages({
    'string.empty': 'Payment method is required',
    'any.required': 'Payment method is required',
  }),
  couponCode: Joi.string().allow(null, '').optional(),
});

// Validate body when updating order to paid
export const payOrderSchema = Joi.object({
  paymentResult: paymentResultSchema.required().messages({
    'any.required': 'Payment result is required',
  }),
});

