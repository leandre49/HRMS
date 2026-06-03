const BASE_URL = '/api';

async function request(url, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  // Employees
  getEmployees: (params) => request(`/employees?${new URLSearchParams(params)}`),
  getEmployee: (id) => request(`/employees/${id}`),
  createEmployee: (data) => request('/employees', { method: 'POST', body: data }),
  updateEmployee: (id, data) => request(`/employees/${id}`, { method: 'PUT', body: data }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: 'DELETE' }),

  // Purchases
  getPurchases: (params) => request(`/purchases?${new URLSearchParams(params)}`),
  getPurchase: (id) => request(`/purchases/${id}`),
  createPurchase: (data) => request('/purchases', { method: 'POST', body: data }),
  updatePurchase: (id, data) => request(`/purchases/${id}`, { method: 'PUT', body: data }),
  deletePurchase: (id) => request(`/purchases/${id}`, { method: 'DELETE' }),

  // Sales
  getSales: (params) => request(`/sales?${new URLSearchParams(params)}`),
  getSale: (id) => request(`/sales/${id}`),
  createSale: (data) => request('/sales', { method: 'POST', body: data }),
  updateSale: (id, data) => request(`/sales/${id}`, { method: 'PUT', body: data }),
  deleteSale: (id) => request(`/sales/${id}`, { method: 'DELETE' }),

  // Reports
  getDashboard: () => request('/reports/dashboard'),
  getSalesSummary: (params) => request(`/reports/sales-summary?${new URLSearchParams(params)}`),
  getPurchaseSummary: (params) => request(`/reports/purchase-summary?${new URLSearchParams(params)}`),
  getProfitLoss: (params) => request(`/reports/profit-loss?${new URLSearchParams(params)}`),
  getTopItems: (limit) => request(`/reports/top-items?limit=${limit || 10}`),
  getSalesByCategory: () => request('/reports/sales-by-category'),
  getPurchasesByCategory: () => request('/reports/purchases-by-category'),
  getMonthlySales: (year) => request(`/reports/monthly-sales?year=${year || new Date().getFullYear()}`),
  getEmployeePerformance: () => request('/reports/employee-performance'),

  // Categories
  getCategories: () => request('/categories'),
};
