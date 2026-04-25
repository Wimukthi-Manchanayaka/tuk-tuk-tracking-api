class APIError extends Error {
    constructor(message, statusCode, description = '') {
      super(message);
      this.statusCode = statusCode;
      this.description = description;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = APIError;