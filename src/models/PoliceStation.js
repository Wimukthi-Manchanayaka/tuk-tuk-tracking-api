const mongoose = require('mongoose');

const PoliceStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    unique: true,
    trim: true,
    maxlength: [150, 'Station name cannot exceed 150 characters']
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: [true, 'District reference is required']
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Province',
    required: [true, 'Province reference is required']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [300, 'Address cannot exceed 300 characters']
  },
  contactNumber: {
    type: String,
    trim: true,
    maxlength: [20, 'Contact number cannot exceed 20 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PoliceStation', PoliceStationSchema);