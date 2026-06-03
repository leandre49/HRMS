import { Router } from 'express';

const router = Router();

export default function purchaseRoutes(db) {
  router.get('/', (req, res) => {
    const { startDate, endDate, category, supplier } = req.query;
    let sql = `SELECT p.*, e.name as employee_name
               FROM purchases p
               LEFT JOIN employees e ON p.employee_id = e.id
               WHERE 1=1`;
    const params = [];

    if (startDate) { sql += ' AND p.purchase_date >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND p.purchase_date <= ?'; params.push(endDate); }
    if (category) { sql += ' AND p.category = ?'; params.push(category); }
    if (supplier) { sql += ' AND p.supplier = ?'; params.push(supplier); }

    sql += ' ORDER BY p.created_at DESC';
    res.json(db.all(sql, ...params));
  });

  router.get('/:id', (req, res) => {
    const purchase = db.get(
      `SELECT p.*, e.name as employee_name
       FROM purchases p
       LEFT JOIN employees e ON p.employee_id = e.id
       WHERE p.id = ?`,
      req.params.id
    );
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });
    res.json(purchase);
  });

  router.post('/', (req, res) => {
    const { item_name, category, supplier, quantity, unit_price, purchase_date, employee_id } = req.body;

    if (!item_name || !category || !supplier || !quantity || !unit_price || !purchase_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const total_cost = quantity * unit_price;

    const result = db.run(
      `INSERT INTO purchases (item_name, category, supplier, quantity, unit_price, total_cost, purchase_date, employee_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      item_name, category, supplier, quantity, unit_price, total_cost, purchase_date, employee_id || null
    );

    const purchase = db.get(
      `SELECT p.*, e.name as employee_name
       FROM purchases p
       LEFT JOIN employees e ON p.employee_id = e.id
       WHERE p.id = ?`,
      result.lastInsertRowid
    );

    res.status(201).json(purchase);
  });

  router.put('/:id', (req, res) => {
    const existing = db.get('SELECT * FROM purchases WHERE id = ?', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Purchase not found' });

    const { item_name, category, supplier, quantity, unit_price, purchase_date, employee_id, status } = req.body;
    const q = quantity ?? existing.quantity;
    const up = unit_price ?? existing.unit_price;
    const total_cost = q * up;

    db.run(
      `UPDATE purchases SET
        item_name = COALESCE(?, item_name),
        category = COALESCE(?, category),
        supplier = COALESCE(?, supplier),
        quantity = COALESCE(?, quantity),
        unit_price = COALESCE(?, unit_price),
        total_cost = ?,
        purchase_date = COALESCE(?, purchase_date),
        employee_id = COALESCE(?, employee_id),
        status = COALESCE(?, status)
      WHERE id = ?`,
      item_name, category, supplier, quantity, unit_price, total_cost, purchase_date, employee_id, status, req.params.id
    );

    const purchase = db.get(
      `SELECT p.*, e.name as employee_name
       FROM purchases p LEFT JOIN employees e ON p.employee_id = e.id WHERE p.id = ?`,
      req.params.id
    );
    res.json(purchase);
  });

  router.delete('/:id', (req, res) => {
    const result = db.run('DELETE FROM purchases WHERE id = ?', req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Purchase not found' });
    res.json({ message: 'Purchase deleted' });
  });

  return router;
}
