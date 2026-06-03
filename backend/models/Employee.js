import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    empFirstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    empLastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    empGender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    empDateOfBirth: {
      type: Date,
    },
    empEmail: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    empTelephone: {
      type: String,
      trim: true,
    },
    empAddress: {
      type: String,
      trim: true,
    },
    empHireDate: {
      type: Date,
      default: Date.now,
    },
    empStatus: {
      type: String,
      enum: ['on leave', 'left', 'blacklisted', 'deceased', 'on mission', 'active'],
      default: 'active',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Employee', employeeSchema);
