const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// this is a validator middleware to validate requests in order to catch errors before it is sent to the database
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new AppError(
        errors
          .array()
          .map((err) => err.msg)
          .join(', '),
        400,
      ),
    );
  }
  next();
};

module.exports = validatorMiddleware;
