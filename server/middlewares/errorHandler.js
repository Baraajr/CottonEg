const AppError = require('../utils/appError');

// handle the error from invalid id
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//handle duplicate fields
const handleDuplicateFieldsDB = (err) => {
  const keyValue = err.keyValue || err.cause?.keyValue;
  const field = keyValue ? Object.keys(keyValue)[0] : 'unknown field';
  const value = keyValue ? keyValue[field] : 'duplicate value';

  const message = `Duplicate field ${field}: '${value}'. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('your token has expired! please log in again', 401);

// Sending Development Errors
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
    error: err,
    stack: err.stack,
  });
};

// Sending Production Errors
const sendErrorProd = (err, res) => {
  // send the error if (operational) means that i created that error so it's safe to send
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
      status: err.status,
    });
  } else {
    //means the error is coming from other place (might contain sensitive data)
    // 1) Log error only in non-production environments
    if (process.env.NODE_ENV === 'production') {
      console.error('ERROR 💥', err);
    }

    // 2) Send generic message
    return res.status(err.statusCode).json({
      message: 'Something went wrong! Please try again later.',
      err,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // copying the error
  let error = Object.assign(err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'test'
  ) {
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000 || error.cause?.code === 11000)
      error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
