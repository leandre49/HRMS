// backend/models/Department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', departmentSchema);
