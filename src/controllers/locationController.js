const LocationPing = require('../models/LocationPing');
const Vehicle = require('../models/Vehicle');
const APIError = require('../utils/apiError');

// @desc    Receive GPS ping from device
// @route   POST /api/v1/locations/ping
exports.postPing = async (req, res, next) => {
  try {
    // DEVICE role sends their vehicleId in JWT or in body
    // Find vehicle by deviceId from the logged-in user's linked device
    const { latitude, longitude, speed, heading, vehicleId } = req.body;

    let vehicle;
    if (vehicleId) {
      vehicle = await Vehicle.findById(vehicleId);
    } else {
      // Device user's email matches their deviceId pattern
      vehicle = await Vehicle.findOne({ deviceId: req.user.email });
    }

    if (!vehicle) {
      return next(new APIError('Vehicle not found', 404, 'No vehicle linked to this device'));
    }

    if (!vehicle.isActive) {
      return next(new APIError('Vehicle is inactive', 403, 'This vehicle has been deactivated'));
    }

    const ping = await LocationPing.create({
      vehicle: vehicle._id,
      latitude,
      longitude,
      speed: speed || 0,
      heading: heading || 0
    });

    res.status(201).json({
      success: true,
      data: ping,
      message: 'Location ping recorded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get last known location of a vehicle (live view)
// @route   GET /api/v1/locations/vehicles/:vehicleId/last
exports.getLastLocation = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId)
      .populate('province', 'name')
      .populate('district', 'name')
      .populate('station', 'name');

    if (!vehicle) {
      return next(new APIError('Vehicle not found', 404, `No vehicle with ID ${req.params.vehicleId}`));
    }

    const lastPing = await LocationPing.findOne({ vehicle: req.params.vehicleId })
      .sort({ timestamp: -1 });

    if (!lastPing) {
      return next(new APIError('No location data found', 404, 'This vehicle has not sent any location pings yet'));
    }

    res.status(200).json({
      success: true,
      data: {
        vehicle: {
          id: vehicle._id,
          registrationNumber: vehicle.registrationNumber,
          driverName: vehicle.driverName,
          province: vehicle.province,
          district: vehicle.district,
          station: vehicle.station,
          isActive: vehicle.isActive
        },
        lastLocation: {
          latitude: lastPing.latitude,
          longitude: lastPing.longitude,
          speed: lastPing.speed,
          heading: lastPing.heading,
          timestamp: lastPing.timestamp
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get location history of a vehicle
// @route   GET /api/v1/locations/vehicles/:vehicleId/history
exports.getLocationHistory = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    if (!vehicle) {
      return next(new APIError('Vehicle not found', 404, `No vehicle with ID ${req.params.vehicleId}`));
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    // Time window filter
    const filter = { vehicle: req.params.vehicleId };
    if (req.query.startDate || req.query.endDate) {
      filter.timestamp = {};
      if (req.query.startDate) filter.timestamp.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.timestamp.$lte = new Date(req.query.endDate);
    }

    const total = await LocationPing.countDocuments(filter);
    const pings = await LocationPing.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      vehicle: {
        id: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        driverName: vehicle.driverName
      },
      count: pings.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        next: page < Math.ceil(total / limit) ? page + 1 : null,
        previous: page > 1 ? page - 1 : null
      },
      data: pings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live locations of all active vehicles (overview map)
// @route   GET /api/v1/locations/live
exports.getLiveLocations = async (req, res, next) => {
  try {
    // Build vehicle filter
    const vehicleFilter = { isActive: true };
    if (req.query.province) vehicleFilter.province = req.query.province;
    if (req.query.district) vehicleFilter.district = req.query.district;
    if (req.query.station) vehicleFilter.station = req.query.station;

    const vehicles = await Vehicle.find(vehicleFilter, '_id registrationNumber driverName province district station');
    const vehicleIds = vehicles.map(v => v._id);

    // Aggregation pipeline: get most recent ping per vehicle in ONE database query
    const liveLocations = await LocationPing.aggregate([
      { $match: { vehicle: { $in: vehicleIds } } },
      { $sort: { vehicle: 1, timestamp: -1 } },
      {
        $group: {
          _id: '$vehicle',
          latitude: { $first: '$latitude' },
          longitude: { $first: '$longitude' },
          speed: { $first: '$speed' },
          heading: { $first: '$heading' },
          timestamp: { $first: '$timestamp' }
        }
      }
    ]);

    // Combine vehicle details with location data
    const vehicleMap = {};
    vehicles.forEach(v => { vehicleMap[v._id.toString()] = v; });

    const result = liveLocations.map(loc => ({
      vehicle: vehicleMap[loc._id.toString()],
      lastLocation: {
        latitude: loc.latitude,
        longitude: loc.longitude,
        speed: loc.speed,
        heading: loc.heading,
        timestamp: loc.timestamp
      }
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
};