const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  deviceId: {
    type: String,
    required: [true, 'Device ID is required'],
    unique: true,
    trim: true
  },
  driverName: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true
  },
  driverNIC: {
    type: String,
    required: [true, 'Driver NIC is required'],
    unique: true,
    trim: true
  },
  driverPhone: {
    type: String,
    trim: true
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Province',
    required: [true, 'Province is required']
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: [true, 'District is required']
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoliceStation',
    required: [true, 'Police station is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', VehicleSchema);