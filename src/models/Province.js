const mongoose = require('mongoose');

const ProvinceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Province name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Province name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Province code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Province code cannot exceed 10 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Province', ProvinceSchema);