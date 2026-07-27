import Joi from 'joi';

// Schema con: từng item trong đơn hàng
const orderItemSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Tên sản phẩm không được để trống',
    'any.required': 'Tên sản phẩm là bắt buộc',
  }),
  qty: Joi.number().integer().min(1).required().messages({
    'number.base': 'Số lượng phải là số',
    'number.min': 'Số lượng phải lớn hơn hoặc bằng 1',
    'any.required': 'Số lượng là bắt buộc',
  }),
  image: Joi.string().required().messages({
    'any.required': 'Ảnh sản phẩm là bắt buộc',
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Giá phải lớn hơn hoặc bằng 0',
    'any.required': 'Giá là bắt buộc',
  }),
  _id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID sản phẩm không hợp lệ',
      'any.required': 'ID sản phẩm là bắt buộc',
    }),
});

// Schema con: kết quả thanh toán (PayPal/Stripe trả về)
const paymentResultSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().required(),
  update_time: Joi.string().required(),
  email_address: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

// Validate body khi tạo đơn hàng mới: POST /api/orders
export const createOrderSchema = Joi.object({
  orderItems: Joi.array().items(orderItemSchema).min(1).required().messages({
    'array.min': 'Đơn hàng phải có ít nhất 1 sản phẩm',
    'any.required': 'Danh sách sản phẩm là bắt buộc',
  }),
  shippingAddress: shippingAddressSchema.required(),
  paymentMethod: Joi.string().trim().required().messages({
    'any.required': 'Phương thức thanh toán là bắt buộc',
  }),
  itemsPrice: Joi.number().min(0).required(),
  taxPrice: Joi.number().min(0).required(),
  shippingPrice: Joi.number().min(0).required(),
  totalPrice: Joi.number().min(0).required(),
});

// Validate body khi cập nhật đã thanh toán
export const payOrderSchema = Joi.object({
  paymentResult: paymentResultSchema.required(),
});
