export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Trả về tất cả lỗi cùng lúc
    stripUnknown: true, // tự động loại field lạ không có trong schema
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  req.body = value; // gán lại body đã được Joi "làm sạch"
  next();
};

// Validate req.params (dùng cho check :id hợp lệ)
export const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Validate req.query (dùng cho filter, search, pagination...)
export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.query = value;
  next();
};
