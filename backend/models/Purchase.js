import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  unit_price: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative'],
  },
  purchase_date: {
    type: String,
    required: [true, 'Purchase date is required'],
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
}, { timestamps: true, toJSON: { virtuals: true } });

purchaseSchema.virtual('total_cost').get(function () {
  return this.quantity * this.unit_price;
});

export default mongoose.model('Purchase', purchaseSchema);
