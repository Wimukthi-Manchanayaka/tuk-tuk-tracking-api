const jwt = require('jsonwebtoken');
const User = require('../models/User');
const APIError = require('../utils/apiError');

// Protect routes - check JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new APIError('Not authorized - no token provided', 401, 
        'Please login and include your Bearer token in the Authorization header'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return next(new APIError('User not found', 401, 'The user associated with this token no longer exists'));
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new APIError(
        'Access denied', 
        403, 
        `Your role '${req.user.role}' does not have permission to perform this action. Required roles: ${roles.join(', ')}`
      ));
    }
    next();
  };
};