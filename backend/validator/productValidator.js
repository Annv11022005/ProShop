import Joi from 'joi';

const imageSchema = Joi.alternatives().try(
  Joi.string().uri().messages({
    'string.uri': 'Invalid image URL format',
  }),
  Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required().messages({
        'string.empty': 'Image URL is required',
        'string.uri': 'Invalid image URL format',
        'any.required': 'Image URL is required',
      }),
      fileId: Joi.string().allow(null, ''),
    }),
  ),
);

const variantsSchema = Joi.array().items(
  Joi.object({
    color: Joi.string().required().messages({
      'string.empty': 'Color is required',
      'any.required': 'Color is required',
    }),
    size: Joi.string().required().messages({
      'string.empty': 'Size is required',
      'any.required': 'Size is required',
    }),
    sku: Joi.string().required().messages({
      'string.empty': 'SKU is required',
      'any.required': 'SKU is required',
    }),
    price: Joi.number().min(0).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be greater than or equal to 0',
      'any.required': 'Price is required',
    }),
    originalPrice: Joi.number().min(0).required().messages({
      'number.base': 'Original price must be a number',
      'number.min': 'Original price must be greater than or equal to 0',
      'any.required': 'Original price is required',
    }),
    countInStock: Joi.number().integer().min(0).required().messages({
      'number.base': 'Count in stock must be a number',
      'number.integer': 'Count in stock must be an integer',
      'number.min': 'Count in stock must be greater than or equal to 0',
      'any.required': 'Count in stock is required',
    }),
    images: imageSchema,
  }),
);

const productFields = {
  name: Joi.string().trim().messages({
    'string.empty': 'Product name cannot be left blank',
    'any.required': 'Product name is required',
  }),
  image: imageSchema,
  brand: Joi.string().trim().messages({
    'string.empty': 'Brand is required',
    'any.required': 'Brand is required',
  }),
  category: Joi.string().trim().messages({
    'string.empty': 'Category is required',
    'any.required': 'Category is required',
  }),
  description: Joi.string().trim().min(10).messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 10 characters',
    'any.required': 'Description is required',
  }),
  subtitle: Joi.string().trim().allow(''),
  status: Joi.string().valid('Draft', 'Active', 'Schedule'),
  variants: variantsSchema,
  // Legacy admin form fields are converted into one default variant by the controller.
  price: Joi.number().min(0).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be greater than or equal to 0',
  }),
  originalPrice: Joi.number().min(0).messages({
    'number.base': 'Original price must be a number',
    'number.min': 'Original price must be greater than or equal to 0',
  }),
  countInStock: Joi.number().integer().min(0).messages({
    'number.base': 'Count in stock must be a number',
    'number.integer': 'Count in stock must be an integer',
    'number.min': 'Count in stock must be greater than or equal to 0',
  }),
};

export const createProductSchema = Joi.object({
  ...productFields,
  name: productFields.name.required(),
  image: imageSchema.required().messages({
    'any.required': 'Product image is required',
  }),
  brand: productFields.brand.required(),
  category: productFields.category.required(),
  description: productFields.description.required(),
}).or('variants', 'price');

export const updateProductSchema = Joi.object(productFields).min(1);

