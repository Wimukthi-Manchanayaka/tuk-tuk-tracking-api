const User = require('../models/User');
const APIError = require('../utils/apiError');

// @desc    Login user
// @route   POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user (explicitly select password since it's hidden by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      return next(new APIError('Invalid credentials', 401, 'Email or password is incorrect'));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new APIError('Invalid credentials', 401, 'Email or password is incorrect'));
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register new user (HQ_ADMIN only)
// @route   POST /api/v1/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, province, station } = req.body;

    const user = await User.create({ name, email, password, role, province, station });
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user
// @route   GET /api/v1/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('province', 'name').populate('station', 'name');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};