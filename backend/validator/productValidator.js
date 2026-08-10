import Joi from 'joi';

const imageSchema = Joi.alternatives().try(
  Joi.string().uri(),
  Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      fileId: Joi.string().allow(null, ''),
    }),
  ),
);

const variantsSchema = Joi.array().items(
  Joi.object({
    color: Joi.string().required(),
    size: Joi.string().required(),
    sku: Joi.string().required(),
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0).required(),
    countInStock: Joi.number().integer().min(0).required(),
  }),
);

const productFields = {
  name: Joi.string().trim().messages({
    'string.empty': 'The name product cannot be left blank.',
  }),
  image: imageSchema,
  brand: Joi.string().trim(),
  category: Joi.string().trim(),
  description: Joi.string().trim().min(10),
  subtitle: Joi.string().trim().allow(''),
  status: Joi.string().valid('Draft', 'Active', 'Schedule'),
  variants: variantsSchema,
  // Legacy admin form fields are converted into one default variant by the controller.
  price: Joi.number().min(0),
  originalPrice: Joi.number().min(0),
  countInStock: Joi.number().integer().min(0),
};

export const createProductSchema = Joi.object({
  ...productFields,
  name: productFields.name.required(),
  image: imageSchema.required(),
  brand: productFields.brand.required(),
  category: productFields.category.required(),
  description: productFields.description.required(),
}).or('variants', 'price');

export const updateProductSchema = Joi.object(productFields).min(1);
