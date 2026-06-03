import { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ departmentName: '' });

  useEffect(() => { fetchDepartments(); }, []);

  async function fetchDepartments() {
    setLoading(true);
    try {
      const res = await api.get('/departments');
      setDepartments(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm({ departmentName: '' });
    setShowModal(true);
  }

  function openEdit(d) {
    setEditing(d);
    setForm({ departmentName: d.departmentName });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/departments/${editing._id}`, form);
      } else {
        await api.post('/departments', form);
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <button onClick={openAdd} className="btn-primary">+ Add Department</button>
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
                <th className="px-6 py-3 font-semibold text-gray-600">Department Name</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departments.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{d.departmentName}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(d)} className="text-primary-600 hover:text-primary-800 mr-3">Edit</button>
                    <button onClick={() => handleDelete(d._id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-400">No departments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
            <input className="input" value={form.departmentName} onChange={(e) => setForm({ ...form, departmentName: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
