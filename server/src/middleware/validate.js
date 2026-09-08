const { sendError } = require('../utils/helpers');

/**
 * Validate middleware cho request body
 */
const validate = (schema) => (req, res, next) => {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: rules.message || `${field} là bắt buộc` });
      continue;
    }

    if (value !== undefined && value !== null && value !== '') {
      if (rules.type && typeof value !== rules.type) {
        errors.push({ field, message: `${field} phải là kiểu ${rules.type}` });
      }

      if (rules.minLength && String(value).length < rules.minLength) {
        errors.push({ field, message: `${field} tối thiểu ${rules.minLength} ký tự` });
      }

      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} phải thuộc một trong các giá trị: ${rules.enum.join(', ')}` });
      }
    }
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Dữ liệu không hợp lệ', errors);
  }

  next();
};

module.exports = {
  validate,
};
