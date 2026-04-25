const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'District name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'District name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'District code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'District code cannot exceed 10 characters']
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Province',
    required: [true, 'Province reference is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('District', DistrictSchema);