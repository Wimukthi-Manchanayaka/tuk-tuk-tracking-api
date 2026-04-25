const { body, param, query, validationResult } = require('express-validator');

// Helper to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      message: 'Validation failed',
      description: 'One or more fields have invalid values',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
      moreInfo: '/api-docs'
    });
  }
  next();
};

// Auth validators
exports.validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

exports.validateRegister = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['HQ_ADMIN', 'PROVINCIAL', 'STATION', 'DEVICE'])
    .withMessage('Role must be one of: HQ_ADMIN, PROVINCIAL, STATION, DEVICE'),
  validate
];

// Location ping validator - checks Sri Lanka geographic boundaries
exports.validatePing = [
  body('latitude')
    .isFloat({ min: 5.9, max: 9.9 })
    .withMessage('Latitude must be between 5.9 and 9.9 (Sri Lanka boundary)'),
  body('longitude')
    .isFloat({ min: 79.7, max: 81.9 })
    .withMessage('Longitude must be between 79.7 and 81.9 (Sri Lanka boundary)'),
  body('speed')
    .optional()
    .isFloat({ min: 0, max: 120 })
    .withMessage('Speed must be between 0 and 120 km/h'),
  validate
];

// Vehicle validator
exports.validateVehicle = [
  body('registrationNumber').notEmpty().withMessage('Registration number is required').trim(),
  body('deviceId').notEmpty().withMessage('Device ID is required').trim(),
  body('driverName').notEmpty().withMessage('Driver name is required').trim(),
  body('driverNIC').notEmpty().withMessage('Driver NIC is required').trim(),
  body('province').isMongoId().withMessage('Valid Province ID is required'),
  body('district').isMongoId().withMessage('Valid District ID is required'),
  body('station').isMongoId().withMessage('Valid Station ID is required'),
  validate
];