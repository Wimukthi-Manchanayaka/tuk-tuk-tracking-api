const PoliceStation = require('../models/PoliceStation');
const APIError = require('../utils/apiError');

exports.getStations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.province) filter.province = req.query.province;
    if (req.query.district) filter.district = req.query.district;

    const total = await PoliceStation.countDocuments(filter);
    const stations = await PoliceStation.find(filter)
      .populate('province', 'name code')
      .populate('district', 'name code')
      .sort('name')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: stations.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        next: page < Math.ceil(total / limit) ? page + 1 : null,
        previous: page > 1 ? page - 1 : null
      },
      data: stations
    });
  } catch (error) {
    next(error);
  }
};

exports.getStation = async (req, res, next) => {
  try {
    const station = await PoliceStation.findById(req.params.id)
      .populate('province', 'name code')
      .populate('district', 'name code');
    if (!station) return next(new APIError('Police station not found', 404, `No station with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: station });
  } catch (error) {
    next(error);
  }
};

exports.createStation = async (req, res, next) => {
  try {
    const station = await PoliceStation.create(req.body);
    res.status(201).json({ success: true, data: station });
  } catch (error) {
    next(error);
  }
};

exports.updateStation = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!station) return next(new APIError('Police station not found', 404, `No station with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: station });
  } catch (error) {
    next(error);
  }
};

exports.deleteStation = async (req, res, next) => {
  try {
    const station = await PoliceStation.findByIdAndDelete(req.params.id);
    if (!station) return next(new APIError('Police station not found', 404, `No station with ID ${req.params.id}`));
    res.status(200).json({ success: true, data: {}, message: 'Station deleted successfully' });
  } catch (error) {
    next(error);
  }
};