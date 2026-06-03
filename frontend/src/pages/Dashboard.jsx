import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { state, actions } = useApp();
  const { dashboard, loading } = state;

  useEffect(() => {
    actions.fetchDashboard();
  }, []);

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={dashboard?.total_employees || 0}
          
          color="blue"
        />
        <StatCard
          title="Total Sales"
          value={dashboard?.total_sales || 0}
          
          color="green"
        />
        <StatCard
          title="Total Purchases"
          value={dashboard?.total_purchases || 0}
          
          
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
          {dashboard?.recent_sales?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Employee</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recent_sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100">
                      <td className="py-2">{sale.item_name}</td>
                      <td className="py-2">{sale.customer_name}</td>
                      <td className="py-2 font-medium">
                        {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(sale.total_amount)}
                      </td>
                      <td className="py-2">{sale.employee_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No recent sales</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Purchases</h2>
          {dashboard?.recent_purchases?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Supplier</th>
                    <th className="pb-2">Cost</th>
                    <th className="pb-2">Employee</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recent_purchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-gray-100">
                      <td className="py-2">{purchase.item_name}</td>
                      <td className="py-2">{purchase.supplier}</td>
                      <td className="py-2 font-medium">
                        {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(purchase.total_cost)}
                      </td>
                      <td className="py-2">{purchase.employee_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No recent purchases</p>
          )}
        </div>
      </div>
    </div>
  );
}
