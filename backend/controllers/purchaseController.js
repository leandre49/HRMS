import Purchase from '../models/Purchase.js';

export const getAllPurchases = async (req, res) => {
  try {
    const { search, category, supplier } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { item_name: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (supplier) query.supplier = { $regex: supplier, $options: 'i' };

    const purchases = await Purchase.find(query)
      .populate('employee_id', 'empFirstName empLastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('employee_id', 'empFirstName empLastName');
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });
    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);
    const populated = await purchase.populate('employee_id', 'empFirstName empLastName');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('employee_id', 'empFirstName empLastName');
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });
    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });
    res.status(200).json({ success: true, message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
