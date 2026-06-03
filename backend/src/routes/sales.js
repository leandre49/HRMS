import { Router } from 'express';

const router = Router();

export default function saleRoutes(db) {
  router.get('/', (req, res) => {
    const { startDate, endDate, category, customer } = req.query;
    let sql = `SELECT s.*, e.name as employee_name
               FROM sales s
               LEFT JOIN employees e ON s.employee_id = e.id
               WHERE 1=1`;
    const params = [];

    if (startDate) { sql += ' AND s.sale_date >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND s.sale_date <= ?'; params.push(endDate); }
    if (category) { sql += ' AND s.category = ?'; params.push(category); }
    if (customer) { sql += ' AND s.customer_name LIKE ?'; params.push(`%${customer}%`); }

    sql += ' ORDER BY s.created_at DESC';
    res.json(db.all(sql, ...params));
  });

  router.get('/:id', (req, res) => {
    const sale = db.get(
      `SELECT s.*, e.name as employee_name
       FROM sales s
       LEFT JOIN employees e ON s.employee_id = e.id
       WHERE s.id = ?`,
      req.params.id
    );
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  });

  router.post('/', (req, res) => {
    const { item_name, category, customer_name, quantity, unit_price, sale_date, employee_id } = req.body;

    if (!item_name || !category || !customer_name || !quantity || !unit_price || !sale_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const total_amount = quantity * unit_price;

    const result = db.run(
      `INSERT INTO sales (item_name, category, customer_name, quantity, unit_price, total_amount, sale_date, employee_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      item_name, category, customer_name, quantity, unit_price, total_amount, sale_date, employee_id || null
    );

    const sale = db.get(
      `SELECT s.*, e.name as employee_name
       FROM sales s
       LEFT JOIN employees e ON s.employee_id = e.id
       WHERE s.id = ?`,
      result.lastInsertRowid
    );

    res.status(201).json(sale);
  });

  router.put('/:id', (req, res) => {
    const existing = db.get('SELECT * FROM sales WHERE id = ?', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Sale not found' });

    const { item_name, category, customer_name, quantity, unit_price, sale_date, employee_id, status } = req.body;
    const q = quantity ?? existing.quantity;
    const up = unit_price ?? existing.unit_price;
    const total_amount = q * up;

    db.run(
      `UPDATE sales SET
        item_name = COALESCE(?, item_name),
        category = COALESCE(?, category),
        customer_name = COALESCE(?, customer_name),
        quantity = COALESCE(?, quantity),
        unit_price = COALESCE(?, unit_price),
        total_amount = ?,
        sale_date = COALESCE(?, sale_date),
        employee_id = COALESCE(?, employee_id),
        status = COALESCE(?, status)
      WHERE id = ?`,
      item_name, category, customer_name, quantity, unit_price, total_amount, sale_date, employee_id, status, req.params.id
    );

    const sale = db.get(
      `SELECT s.*, e.name as employee_name
       FROM sales s LEFT JOIN employees e ON s.employee_id = e.id WHERE s.id = ?`,
      req.params.id
    );
    res.json(sale);
  });

  router.delete('/:id', (req, res) => {
    const result = db.run('DELETE FROM sales WHERE id = ?', req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Sale not found' });
    res.json({ message: 'Sale deleted' });
  });

  return router;
}
