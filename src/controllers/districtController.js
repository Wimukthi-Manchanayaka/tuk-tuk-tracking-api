const District = require('../models/District');
const APIError = require('../utils/apiError');

exports.getDistricts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    // Filter by province if provided
    const filter = {};
    if (req.query.province) filter.province = req.query.province;

    const total = await District.countDocuments(filter);
    const districts = await District.find(filter)
      .populate('province', 'name code')
      .sort('name')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: districts.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        next: page < Math.ceil(total / limit) ? page + 1 : null,
        previous: page > 1 ? page - 1 : null
      },
      data: districts
    });
  } catch (error) {
    next(error);
  }
};

exports.getDistrict = async (req, res, next) => {
  try {
    const district = await District.findById(req.params.id).populate('province', 'name code');
    if (!district) return next(new APIError('District not found', 404, `No district with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: district });
  } catch (error) {
    next(error);
  }
};

exports.createDistrict = async (req, res, next) => {
  try {
    const district = await District.create(req.body);
    res.status(201).json({ success: true, data: district });
  } catch (error) {
    next(error);
  }
};

exports.updateDistrict = async (req, res, next) => {
  try {
    const district = await District.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!district) return next(new APIError('District not found', 404, `No district with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: district });
  } catch (error) {
    next(error);
  }
};

exports.deleteDistrict = async (req, res, next) => {
  try {
    const district = await District.findByIdAndDelete(req.params.id);
    if (!district) return next(new APIError('District not found', 404, `No district with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: {}, message: 'District deleted successfully' });
  } catch (error) {
    next(error);
  }
};