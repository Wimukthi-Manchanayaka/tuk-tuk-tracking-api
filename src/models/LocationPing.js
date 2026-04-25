const mongoose = require('mongoose');

const LocationPingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle reference is required']
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [5.9, 'Latitude must be within Sri Lanka boundary'],
    max: [9.9, 'Latitude must be within Sri Lanka boundary']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [79.7, 'Longitude must be within Sri Lanka boundary'],
    max: [81.9, 'Longitude must be within Sri Lanka boundary']
  },
  speed: {
    type: Number,
    default: 0,
    min: 0,
    max: 120
  },
  heading: {
    type: Number,
    default: 0,
    min: 0,
    max: 360
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for fast location queries per vehicle sorted by time
LocationPingSchema.index({ vehicle: 1, timestamp: -1 });
LocationPingSchema.index({ timestamp: -1 });

module.exports = mongoose.model('LocationPing', LocationPingSchema);