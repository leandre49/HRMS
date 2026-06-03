import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const emptyForm = {
  item_name: '', category: '', supplier: '', quantity: '', unit_price: '', purchase_date: '', employee_id: '',
};

export default function Purchases() {
  const { state, actions } = useApp();
  const { purchases, employees, categories, loading } = state;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  useEffect(() => {
    actions.fetchPurchases();
    actions.fetchEmployees();
    if (categories.length === 0) actions.fetchCategories();
  }, []);

  const filtered = purchases.filter((p) =>
    p.item_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.supplier?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      item_name: p.item_name,
      category: p.category,
      supplier: p.supplier,
      quantity: p.quantity,
      unit_price: p.unit_price,
      purchase_date: p.purchase_date,
      employee_id: p.employee_id || '',
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await actions.updatePurchase(editing.id, form);
      } else {
        await actions.createPurchase(form);
      }
      setShowModal(false);
    } catch (_) { }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this purchase record?')) {
      await actions.deletePurchase(id);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
        <button onClick={openAdd} className="btn-primary">+ Record Purchase</button>
      </div>

      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search purchases..."
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Item</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Category</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Supplier</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Qty</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Unit Price</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Total Cost</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{p.item_name}</td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4">{p.supplier}</td>
                  <td className="px-6 py-4">{p.quantity}</td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(p.unit_price)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(p.total_cost)}
                  </td>
                  <td className="px-6 py-4">{p.purchase_date}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(p)} className="text-primary-600 hover:text-primary-800 mr-3">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400">No purchase records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Purchase' : 'Record Purchase'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input className="input" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
              <input className="input" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" min="1" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (RWF) *</label>
              <input type="number" min="0" className="input" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date *</label>
              <input type="date" className="input" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Processed By</label>
              <select className="input" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}>
                <option value="">Select employee</option>
                {employees.filter(e => e.empStatus === 'active').map((e) => (
                  <option key={e._id} value={e._id}>{e.empFirstName} {e.empLastName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Record'} Purchase</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
