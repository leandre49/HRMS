import { useEffect, useState } from 'react';
import reportService from '../services/reportService';

export default function Dashboard() {
  const [statusSummary, setStatusSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const res = await reportService.getStatusSummary();
      setStatusSummary(res.data?.data?.statusSummary || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
      console.error('Failed to load dashboard:', err);
    }
    setLoading(false);
  }

  const totalEmployees = statusSummary.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statusSummary.map((item) => (
          <div key={item._id} className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{item.count}</div>
            <div className="text-sm text-gray-600 capitalize mt-2">{item._id}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Employee Status Overview</h2>
        {/* <div className="space-y-3">
          {statusSummary.map((item) => {
            const percentage = totalEmployees > 0 ? (item.count / totalEmployees) * 100 : 0;
            return (
              <div key={item._id} className="flex items-center gap-4">
                <span className="text-sm font-medium w-24 capitalize">{item._id}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className="h-full bg-primary-600 flex items-center justify-end pr-3 transition-all"
                    style={{ width: `${percentage}%`, minWidth: percentage > 0 ? '3rem' : '0' }}
                  >
                    {percentage > 10 && <span className="text-xs text-white font-medium">{item.count}</span>}
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div> */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Employees</span>
            <span className="text-2xl font-bold text-primary-600">{totalEmployees}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
