const { validationResult } = require('express-validator');
const { BadRequestError } = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));
    const firstErrorMessage = errorDetails[0]?.message || 'Validation failed';
    throw new BadRequestError(firstErrorMessage, errorDetails);
  }
  next();
};

module.exports = validate;
