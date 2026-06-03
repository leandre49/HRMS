import { useEffect, useState } from 'react';
import employeeService from '../services/employeeService';
import departmentService from '../services/departmentService';
import positionService from '../services/positionService';

const emptyForm = {
  empFirstName: '',
  empLastName: '',
  empGender: 'Male',
  empDateOfBirth: '',
  empEmail: '',
  empTelephone: '',
  empAddress: '',
  empHireDate: new Date().toISOString().split('T')[0],
  empStatus: 'active',
  department: '',
  position: '',
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [empRes, deptRes, posRes] = await Promise.all([
        employeeService.getAllEmployees({}),
        departmentService.getAllDepartments(),
        positionService.getAllPositions(),
      ]);
      setEmployees(empRes.data?.data || []);
      setDepartments(deptRes.data?.data || []);
      setPositions(posRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
      console.error('Failed to load data:', err);
    }
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(emp) {
    setEditing(emp);
    setForm({
      empFirstName: emp.empFirstName || '',
      empLastName: emp.empLastName || '',
      empGender: emp.empGender || 'Male',
      empDateOfBirth: emp.empDateOfBirth || '',
      empEmail: emp.empEmail || '',
      empTelephone: emp.empTelephone || '',
      empAddress: emp.empAddress || '',
      empHireDate: emp.empHireDate ? emp.empHireDate.split('T')[0] : '',
      empStatus: emp.empStatus || 'active',
      department: emp.department?._id || '',
      position: emp.position?._id || '',
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await employeeService.updateEmployee(editing._id, form);
      } else {
        await employeeService.createEmployee(form);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      console.error('Error:', err);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Delete failed');
        console.error('Delete error:', err);
      }
    }
  }

  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.empFirstName?.toLowerCase().includes(search.toLowerCase()) ||
      e.empLastName?.toLowerCase().includes(search.toLowerCase()) ||
      e.empEmail?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !filterStatus || e.empStatus === filterStatus;
    const matchesDept = !filterDept || e.department?._id === filterDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <button onClick={openAdd} className="btn-primary">+ Add Employee</button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="card mb-6 space-y-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="on leave">On Leave</option>
            <option value="left">Left</option>
            <option value="blacklisted">Blacklisted</option>
            <option value="deceased">Deceased</option>
            <option value="on mission">On Mission</option>
          </select>
          <select
            className="input"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.departmentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Department</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Position</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {emp.empFirstName} {emp.empLastName}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{emp.empEmail}</td>
                    <td className="px-6 py-4">{emp.department?.departmentName || '-'}</td>
                    <td className="px-6 py-4">{emp.position?.posName || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        emp.empStatus === 'active'
                          ? 'bg-green-100 text-green-800'
                          : emp.empStatus === 'on leave'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {emp.empStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEdit(emp)}
                        className="text-primary-600 hover:text-primary-800 mr-3 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {editing ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    className="input"
                    value={form.empFirstName}
                    onChange={(e) => setForm({ ...form, empFirstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    className="input"
                    value={form.empLastName}
                    onChange={(e) => setForm({ ...form, empLastName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    className="input"
                    value={form.empEmail}
                    onChange={(e) => setForm({ ...form, empEmail: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                  <input
                    className="input"
                    value={form.empTelephone}
                    onChange={(e) => setForm({ ...form, empTelephone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    className="input"
                    value={form.empGender}
                    onChange={(e) => setForm({ ...form, empGender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    className="input"
                    value={form.empDateOfBirth}
                    onChange={(e) => setForm({ ...form, empDateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    className="input"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    className="input"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  >
                    <option value="">Select position</option>
                    {positions.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.posName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                  <input
                    type="date"
                    className="input"
                    value={form.empHireDate}
                    onChange={(e) => setForm({ ...form, empHireDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="input"
                    value={form.empStatus}
                    onChange={(e) => setForm({ ...form, empStatus: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="on leave">On Leave</option>
                    <option value="left">Left</option>
                    <option value="blacklisted">Blacklisted</option>
                    <option value="deceased">Deceased</option>
                    <option value="on mission">On Mission</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    className="input"
                    value={form.empAddress}
                    onChange={(e) => setForm({ ...form, empAddress: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editing ? 'Update' : 'Create'} Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
