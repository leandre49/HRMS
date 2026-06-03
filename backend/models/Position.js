import mongoose from 'mongoose';

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

export default mongoose.model('Position', positionSchema);
