import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'The name product cannot be left blank.',
  }),
  image: Joi.string().uri().required(),
  brand: Joi.string().trim().required(),
  category: Joi.string().trim().required(),
  description: Joi.string().trim().min(10).required(),
  price: Joi.number().min(0).required(),
  countInStock: Joi.number().integer().min(0).required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  image: Joi.string().uri(),
  brand: Joi.string().trim(),
  category: Joi.string().trim(),
  description: Joi.string().trim().min(10),
  price: Joi.number().min(0),
  countInStock: Joi.number().integer().min(0),
}).min(1); // Bắt buộc phải có 1 field được gửi
