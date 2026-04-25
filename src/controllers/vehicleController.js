const Vehicle = require('../models/Vehicle');
const APIError = require('../utils/apiError');

exports.getVehicles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.province) filter.province = req.query.province;
    if (req.query.district) filter.district = req.query.district;
    if (req.query.station) filter.station = req.query.station;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const total = await Vehicle.countDocuments(filter);
    const vehicles = await Vehicle.find(filter)
      .populate('province', 'name code')
      .populate('district', 'name code')
      .populate('station', 'name')
      .sort('registrationNumber')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        next: page < Math.ceil(total / limit) ? page + 1 : null,
        previous: page > 1 ? page - 1 : null
      },
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('province', 'name code')
      .populate('district', 'name code')
      .populate('station', 'name');
    if (!vehicle) return next(new APIError('Vehicle not found', 404, `No vehicle with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicle) return next(new APIError('Vehicle not found', 404, `No vehicle with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

exports.deactivateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!vehicle) return next(new APIError('Vehicle not found', 404, `No vehicle with ID ${req.params.id}`));
    res.status(200).json({
      success: true,
      data: vehicle,
      message: 'Vehicle deactivated. Location history preserved.'
    });
  } catch (error) {
    next(error);
  }
};