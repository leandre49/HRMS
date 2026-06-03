import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

function Bar({ value, max, label, color = 'bg-primary-500' }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-sm text-gray-600 w-32 truncate text-right">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color} flex items-center justify-end pr-2`}
          style={{ width: `${pct}%`, minWidth: pct > 0 ? '2rem' : '0' }}
        >
          <span className="text-xs text-white font-medium">
            {typeof value === 'number' && value > 999
              ? (value / 1000).toFixed(1) + 'k'
              : value}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Reports() {
  const { state } = useApp();
  const { employees } = state;

  const [salesSummary, setSalesSummary] = useState(null);
  const [purchaseSummary, setPurchaseSummary] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [purchasesByCategory, setPurchasesByCategory] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [employeePerf, setEmployeePerf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const [ss, ps, pl, ti, sbc, pbc, ms, ep] = await Promise.all([
        api.getSalesSummary(params),
        api.getPurchaseSummary(params),
        api.getProfitLoss(params),
        api.getTopItems(10),
        api.getSalesByCategory(),
        api.getPurchasesByCategory(),
        api.getMonthlySales(),
        api.getEmployeePerformance(),
      ]);

      setSalesSummary(ss);
      setPurchaseSummary(ps);
      setProfitLoss(pl);
      setTopItems(ti);
      setSalesByCategory(sbc);
      setPurchasesByCategory(pbc);
      setMonthlySales(ms);
      setEmployeePerf(ep);
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
    setLoading(false);
  }

  const maxSalesCat = Math.max(...salesByCategory.map((c) => c.total_revenue), 1);
  const maxPurchaseCat = Math.max(...purchasesByCategory.map((c) => c.total_cost), 1);
  const maxTopItem = Math.max(...topItems.map((i) => i.total_revenue), 1);
  const maxMonthly = Math.max(...monthlySales.map((m) => m.revenue), 1);
  const maxPerf = Math.max(...employeePerf.map((e) => e.total_sales), 1);

  const tabs = ['overview', 'sales', 'purchases', 'top-items', 'employees'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center gap-3">
          <input
            type="date"
            className="input w-auto"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            className="input w-auto"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
          <button onClick={loadReports} className="btn-primary">Filter</button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-gray-200 inline-flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'top-items' ? 'Top Items' : tab === 'employees' ? 'Employee Perf.' : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                  <p className="text-sm text-gray-500">Total Sales Revenue</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(salesSummary?.total_sales || 0)}</p>
                  <p className="text-xs text-gray-400">{salesSummary?.total_transactions || 0} transactions</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-500">Total Purchase Cost</p>
                  <p className="text-2xl font-bold text-yellow-700">{formatCurrency(purchaseSummary?.total_purchases || 0)}</p>
                  <p className="text-xs text-gray-400">{purchaseSummary?.total_transactions || 0} transactions</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-500">Profit / Loss</p>
                  <p className={`text-2xl font-bold ${(profitLoss?.profit || 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(profitLoss?.profit || 0)}
                  </p>
                  <p className="text-xs text-gray-400">Margin: {profitLoss?.profit_margin || 0}%</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-500">Employee Salaries</p>
                  <p className="text-2xl font-bold text-purple-700">{formatCurrency(profitLoss?.employee_salaries || 0)}</p>
                  <p className="text-xs text-gray-400">Total monthly payroll</p>
                </div>
              </div>

              {/* Revenue vs Cost */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Revenue vs Expenses</h2>
                <div className="space-y-3">
                  <Bar label="Total Revenue" value={profitLoss?.total_revenue || 0} max={Math.max(profitLoss?.total_revenue || 0, profitLoss?.total_expenses || 0)} color="bg-green-500" />
                  <Bar label="Total Expenses" value={profitLoss?.total_expenses || 0} max={Math.max(profitLoss?.total_revenue || 0, profitLoss?.total_expenses || 0)} color="bg-red-500" />
                  <Bar label="Net Profit" value={Math.max(profitLoss?.profit || 0, 0)} max={Math.max(profitLoss?.total_revenue || 0, profitLoss?.total_expenses || 0)} color="bg-primary-500" />
                </div>
              </div>

              {/* Sales by Category */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
                {salesByCategory.map((cat) => (
                  <Bar key={cat.category} label={cat.category} value={cat.total_revenue} max={maxSalesCat} color="bg-blue-500" />
                ))}
                {salesByCategory.length === 0 && <p className="text-gray-400 text-sm">No sales data</p>}
              </div>

              {/* Monthly Sales */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Monthly Sales ({new Date().getFullYear()})</h2>
                <div className="grid grid-cols-12 gap-1 items-end h-40">
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = String(i + 1).padStart(2, '0');
                    const data = monthlySales.find((m) => m.month === month);
                    const value = data ? data.revenue : 0;
                    const pct = maxMonthly > 0 ? (value / maxMonthly) * 100 : 0;
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return (
                      <div key={i} className="flex flex-col items-center justify-end h-full">
                        <span className="text-[10px] text-gray-400 mb-1">
                          {value > 0 ? (value / 1000).toFixed(0) + 'k' : ''}
                        </span>
                        <div
                          className="w-full bg-primary-400 rounded-t transition-all duration-500"
                          style={{ height: `${Math.max(pct, 2)}%`, minHeight: value > 0 ? '4px' : '2px' }}
                        />
                        <span className="text-[10px] text-gray-500 mt-1">{monthNames[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(salesSummary?.total_sales || 0)}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-500">Transactions</p>
                  <p className="text-2xl font-bold">{salesSummary?.total_transactions || 0}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-500">Avg Sale Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(salesSummary?.avg_sale_value || 0)}</p>
                </div>
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
                {salesByCategory.map((cat) => (
                  <Bar key={cat.category} label={cat.category} value={cat.total_revenue} max={maxSalesCat} color="bg-blue-500" />
                ))}
              </div>
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                  <p className="text-sm text-gray-500">Total Purchase Cost</p>
                  <p className="text-2xl font-bold text-yellow-700">{formatCurrency(purchaseSummary?.total_purchases || 0)}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-500">Transactions</p>
                  <p className="text-2xl font-bold">{purchaseSummary?.total_transactions || 0}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-500">Avg Purchase Cost</p>
                  <p className="text-2xl font-bold">{formatCurrency(purchaseSummary?.avg_purchase_cost || 0)}</p>
                </div>
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Purchases by Category</h2>
                {purchasesByCategory.map((cat) => (
                  <Bar key={cat.category} label={cat.category} value={cat.total_cost} max={maxPurchaseCat} color="bg-yellow-500" />
                ))}
              </div>
            </div>
          )}

          {/* Top Items Tab */}
          {activeTab === 'top-items' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Top Selling Items</h2>
              {topItems.map((item, idx) => (
                <Bar key={item.item_name} label={`${idx + 1}. ${item.item_name}`} value={item.total_revenue} max={maxTopItem} color="bg-purple-500" />
              ))}
              {topItems.length === 0 && <p className="text-gray-400 text-sm">No sales data</p>}
            </div>
          )}

          {/* Employee Performance Tab */}
          {activeTab === 'employees' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Employee Performance</h2>
              {employeePerf.length === 0 ? (
                <p className="text-gray-400 text-sm">No data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left">
                      <tr className="border-b">
                        <th className="pb-3 font-semibold text-gray-600">Name</th>
                        <th className="pb-3 font-semibold text-gray-600">Position</th>
                        <th className="pb-3 font-semibold text-gray-600">Department</th>
                        <th className="pb-3 font-semibold text-gray-600">Sales Count</th>
                        <th className="pb-3 font-semibold text-gray-600">Total Sales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {employeePerf.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="py-3 font-medium">{emp.name}</td>
                          <td className="py-3 text-gray-500">{emp.position}</td>
                          <td className="py-3">{emp.department}</td>
                          <td className="py-3">{emp.sales_count}</td>
                          <td className="py-3 font-medium">{formatCurrency(emp.total_sales)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {employeePerf.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Sales by Employee</h3>
                  {employeePerf.map((emp) => (
                    <Bar key={emp.id} label={emp.name} value={emp.total_sales} max={maxPerf} color="bg-teal-500" />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
