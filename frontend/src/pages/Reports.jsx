import { useEffect, useState } from 'react';
import reportService from '../services/reportService';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  'on leave': 'bg-yellow-100 text-yellow-800',
  left: 'bg-red-100 text-red-800',
  blacklisted: 'bg-gray-100 text-gray-800',
  deceased: 'bg-purple-100 text-purple-800',
  'on mission': 'bg-blue-100 text-blue-800',
};

export default function Reports() {
  const [statusSummary, setStatusSummary] = useState([]);
  const [onLeaveReport, setOnLeaveReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, onLeaveRes] = await Promise.all([
        reportService.getStatusSummary(),
        reportService.getOnLeaveReport(),
      ]);

      setStatusSummary(summaryRes.data?.data?.statusSummary || []);
      setOnLeaveReport(onLeaveRes.data?.data?.report || []);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load reports';
      setError(message);
      console.error('Failed to load reports:', err);
    }
    setLoading(false);
  }

  const totalEmployees = statusSummary.reduce((sum, item) => sum + item.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button onClick={loadReports} className="btn-primary">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Employee Status Summary */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Employee Status Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {statusSummary.map((item) => (
                <div key={item._id} className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{item.count}</div>
                  <div className="text-xs text-gray-600 capitalize mt-1">{item._id}</div>
                </div>
              ))}
              <div className="text-center border-t-2 pt-3 col-span-2 md:col-span-3 lg:col-span-6">
                <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
                <div className="text-sm text-gray-600">Total Employees</div>
              </div>
            </div>
          </div>

          {/* On Leave Report */}
          {onLeaveReport.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">
                Employees On Leave ({onLeaveReport.reduce((sum, dept) => sum + dept.total, 0)})
              </h2>
              <div className="space-y-4">
                {onLeaveReport.map((dept) => (
                  <div key={dept.departmentId} className="border rounded p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">{dept.departmentName}</h3>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        {dept.total} employee{dept.total !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {dept.employees.map((emp) => (
                        <div key={emp.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <div>
                            <div className="font-medium text-gray-900">{emp.name}</div>
                            <div className="text-xs text-gray-500">{emp.email}</div>
                            <div className="text-xs text-gray-600">{emp.position}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onLeaveReport.length === 0 && (
            <div className="card bg-green-50 border border-green-200">
              <p className="text-green-800 text-center py-8">✓ No employees on leave</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
