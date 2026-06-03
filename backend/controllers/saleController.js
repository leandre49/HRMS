import Sale from '../models/Sale.js';

export const getAllSales = async (req, res) => {
  try {
    const { search, category, customer } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { item_name: { $regex: search, $options: 'i' } },
        { customer_name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (customer) query.customer_name = { $regex: customer, $options: 'i' };

    const sales = await Sale.find(query)
      .populate('employee_id', 'empFirstName empLastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('employee_id', 'empFirstName empLastName');
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    const populated = await sale.populate('employee_id', 'empFirstName empLastName');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('employee_id', 'empFirstName empLastName');
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
    res.status(200).json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
    res.status(200).json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
