// backend/models/Position.js
const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
  {
    posName: {
      type: String,
      required: [true, 'Position name is required'],
      trim: true,
    },
    requiredQualification: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Position', positionSchema);
