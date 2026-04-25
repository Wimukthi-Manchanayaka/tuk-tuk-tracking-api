const APIError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let description = err.description || '';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    description = `The ID '${err.value}' is not a valid MongoDB ObjectId`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = 'Duplicate field value';
    description = `A record with this ${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    description = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    description = 'The provided JWT token is invalid';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    description = 'Your session has expired. Please login again';
  }

  // WSO2-style error response
  res.status(statusCode).json({
    code: statusCode,
    message: message,
    description: description,
    moreInfo: `https://YOUR-APP-NAME.onrender.com/api-docs`
  });
};

module.exports = errorHandler;