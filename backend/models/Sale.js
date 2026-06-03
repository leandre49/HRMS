import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
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
  customer_name: {
    type: String,
    required: [true, 'Customer name is required'],
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
  sale_date: {
    type: String,
    required: [true, 'Sale date is required'],
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
}, { timestamps: true, toJSON: { virtuals: true } });

saleSchema.virtual('total_amount').get(function () {
  return this.quantity * this.unit_price;
});

export default mongoose.model('Sale', saleSchema);
