import { Router } from 'express';

const router = Router();

export default function reportRoutes(db) {
  router.get('/sales-summary', (req, res) => {
    const { startDate, endDate } = req.query;
    let sql = `SELECT
                COALESCE(SUM(total_amount), 0) as total_sales,
                COUNT(*) as total_transactions,
                COALESCE(AVG(total_amount), 0) as avg_sale_value
               FROM sales WHERE 1=1`;
    const params = [];
    if (startDate) { sql += ' AND sale_date >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND sale_date <= ?'; params.push(endDate); }
    res.json(db.get(sql, ...params));
  });

  router.get('/purchase-summary', (req, res) => {
    const { startDate, endDate } = req.query;
    let sql = `SELECT
                COALESCE(SUM(total_cost), 0) as total_purchases,
                COUNT(*) as total_transactions,
                COALESCE(AVG(total_cost), 0) as avg_purchase_cost
               FROM purchases WHERE 1=1`;
    const params = [];
    if (startDate) { sql += ' AND purchase_date >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND purchase_date <= ?'; params.push(endDate); }
    res.json(db.get(sql, ...params));
  });

  router.get('/profit-loss', (req, res) => {
    const { startDate, endDate } = req.query;
    let dateFilter = '';
    const params = [];
    if (startDate) { dateFilter += ' AND sale_date >= ?'; params.push(startDate); }
    if (endDate) { dateFilter += ' AND sale_date <= ?'; params.push(endDate); }

    const salesResult = db.get(
      `SELECT COALESCE(SUM(total_amount), 0) as total FROM sales WHERE 1=1 ${dateFilter}`,
      ...params
    );

    let pDateFilter = '';
    const pParams = [];
    if (startDate) { pDateFilter += ' AND purchase_date >= ?'; pParams.push(startDate); }
    if (endDate) { pDateFilter += ' AND purchase_date <= ?'; pParams.push(endDate); }

    const purchaseResult = db.get(
      `SELECT COALESCE(SUM(total_cost), 0) as total FROM purchases WHERE 1=1 ${pDateFilter}`,
      ...pParams
    );

    const employeeCost = db.get(
      `SELECT COALESCE(SUM(salary), 0) as total FROM employees WHERE status = 'active'`
    );

    const totalRevenue = salesResult.total;
    const totalExpenses = purchaseResult.total + employeeCost.total;
    const profit = totalRevenue - totalExpenses;

    res.json({
      total_revenue: totalRevenue,
      total_purchases: purchaseResult.total,
      employee_salaries: employeeCost.total,
      total_expenses: totalExpenses,
      profit: profit,
      profit_margin: totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0
    });
  });

  router.get('/top-items', (req, res) => {
    const { limit = 10 } = req.query;
    const items = db.all(
      `SELECT item_name, category, SUM(quantity) as total_qty,
              SUM(total_amount) as total_revenue,
              COUNT(*) as sale_count
       FROM sales
       GROUP BY item_name
       ORDER BY total_revenue DESC
       LIMIT ?`,
      Number(limit)
    );
    res.json(items);
  });

  router.get('/sales-by-category', (req, res) => {
    const data = db.all(
      `SELECT category, COUNT(*) as count,
              SUM(quantity) as total_qty,
              SUM(total_amount) as total_revenue
       FROM sales
       GROUP BY category
       ORDER BY total_revenue DESC`
    );
    res.json(data);
  });

  router.get('/purchases-by-category', (req, res) => {
    const data = db.all(
      `SELECT category, COUNT(*) as count,
              SUM(quantity) as total_qty,
              SUM(total_cost) as total_cost
       FROM purchases
       GROUP BY category
       ORDER BY total_cost DESC`
    );
    res.json(data);
  });

  router.get('/monthly-sales', (req, res) => {
    const { year } = req.query;
    const yr = year || new Date().getFullYear();
    const data = db.all(
      `SELECT substr(sale_date, 6, 2) as month,
              COUNT(*) as count,
              SUM(total_amount) as revenue
       FROM sales
       WHERE substr(sale_date, 1, 4) = ?
       GROUP BY month
       ORDER BY month`,
      String(yr)
    );
    res.json(data);
  });

  router.get('/employee-performance', (req, res) => {
    const data = db.all(
      `SELECT e.id, e.name, e.position, e.department,
              COUNT(s.id) as sales_count,
              COALESCE(SUM(s.total_amount), 0) as total_sales
       FROM employees e
       LEFT JOIN sales s ON e.id = s.employee_id
       GROUP BY e.id
       ORDER BY total_sales DESC`
    );
    res.json(data);
  });

  router.get('/dashboard', (req, res) => {
    const totalEmployees = db.get("SELECT COUNT(*) as count FROM employees WHERE status = ?", 'active');
    const totalSales = db.get('SELECT COALESCE(SUM(total_amount), 0) as total FROM sales');
    const totalPurchases = db.get('SELECT COALESCE(SUM(total_cost), 0) as total FROM purchases');
    const recentSales = db.all(
      `SELECT s.*, e.name as employee_name
       FROM sales s LEFT JOIN employees e ON s.employee_id = e.id
       ORDER BY s.created_at DESC LIMIT 5`
    );
    const recentPurchases = db.all(
      `SELECT p.*, e.name as employee_name
       FROM purchases p LEFT JOIN employees e ON p.employee_id = e.id
       ORDER BY p.created_at DESC LIMIT 5`
    );

    res.json({
      total_employees: totalEmployees.count,
      total_sales: totalSales.total,
      total_purchases: totalPurchases.total,
      recent_sales: recentSales,
      recent_purchases: recentPurchases
    });
  });

  return router;
}
