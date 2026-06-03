import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const emptyForm = {
  item_name: '', category: '', customer_name: '', quantity: '', unit_price: '', sale_date: '', employee_id: '',
};

export default function Sales() {
  const { state, actions } = useApp();
  const { sales, employees, categories, loading } = state;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  useEffect(() => {
    actions.fetchSales();
    actions.fetchEmployees();
    if (categories.length === 0) actions.fetchCategories();
  }, []);

  const filtered = sales.filter((s) =>
    s.item_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(s) {
    setEditing(s);
    setForm({
      item_name: s.item_name,
      category: s.category,
      customer_name: s.customer_name,
      quantity: s.quantity,
      unit_price: s.unit_price,
      sale_date: s.sale_date,
      employee_id: s.employee_id || '',
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await actions.updateSale(editing.id, form);
      } else {
        await actions.createSale(form);
      }
      setShowModal(false);
    } catch (_) { }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      await actions.deleteSale(id);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <button onClick={openAdd} className="btn-primary">+ Record Sale</button>
      </div>

      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search sales..."
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
                <th className="px-6 py-3 font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Qty</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Unit Price</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Total Amount</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{s.item_name}</td>
                  <td className="px-6 py-4">{s.category}</td>
                  <td className="px-6 py-4">{s.customer_name}</td>
                  <td className="px-6 py-4">{s.quantity}</td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(s.unit_price)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(s.total_amount)}
                  </td>
                  <td className="px-6 py-4">{s.sale_date}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(s)} className="text-primary-600 hover:text-primary-800 mr-3">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400">No sales records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Sale' : 'Record Sale'}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input className="input" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Date *</label>
              <input type="date" className="input" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} required />
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
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Record'} Sale</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
