const Province = require('../models/Province');
const APIError = require('../utils/apiError');

// @desc    Get all provinces
// @route   GET /api/v1/provinces
exports.getProvinces = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    const total = await Province.countDocuments();
    const provinces = await Province.find().sort('name').skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      count: provinces.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        next: page < Math.ceil(total / limit) ? page + 1 : null,
        previous: page > 1 ? page - 1 : null
      },
      data: provinces
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single province
// @route   GET /api/v1/provinces/:id
exports.getProvince = async (req, res, next) => {
  try {
    const province = await Province.findById(req.params.id);
    if (!province) return next(new APIError('Province not found', 404, `No province with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: province });
  } catch (error) {
    next(error);
  }
};

// @desc    Create province
// @route   POST /api/v1/provinces
exports.createProvince = async (req, res, next) => {
  try {
    const province = await Province.create(req.body);
    res.status(201).json({ success: true, data: province });
  } catch (error) {
    next(error);
  }
};

// @desc    Update province
// @route   PUT /api/v1/provinces/:id
exports.updateProvince = async (req, res, next) => {
  try {
    const province = await Province.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!province) return next(new APIError('Province not found', 404, `No province with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: province });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete province
// @route   DELETE /api/v1/provinces/:id
exports.deleteProvince = async (req, res, next) => {
  try {
    const province = await Province.findByIdAndDelete(req.params.id);
    if (!province) return next(new APIError('Province not found', 404, `No province with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: {}, message: 'Province deleted successfully' });
  } catch (error) {
    next(error);
  }
};