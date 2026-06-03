import { Router } from 'express';

const router = Router();

export default function employeeRoutes(db) {
  router.get('/', (req, res) => {
    const { status, department } = req.query;
    let sql = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (department) {
      sql += ' AND department = ?';
      params.push(department);
    }

    sql += ' ORDER BY created_at DESC';
    const employees = db.all(sql, ...params);
    res.json(employees);
  });

  router.get('/:id', (req, res) => {
    const employee = db.get('SELECT * FROM employees WHERE id = ?', req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  });

  router.post('/', (req, res) => {
    const { name, email, phone, position, department, salary, hire_date } = req.body;

    if (!name || !email || !position || !department || !salary || !hire_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const result = db.run(
        'INSERT INTO employees (name, email, phone, position, department, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        name, email, phone, position, department, salary, hire_date
      );

      const employee = db.get('SELECT * FROM employees WHERE id = ?', result.lastInsertRowid);
      res.status(201).json(employee);
    } catch (err) {
      if (err.message && err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', (req, res) => {
    const { name, email, phone, position, department, salary, status } = req.body;

    const existing = db.get('SELECT * FROM employees WHERE id = ?', req.params.id);
    if (!existing) return res.status(404).json({ error: 'Employee not found' });

    try {
      db.run(
        `UPDATE employees SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          position = COALESCE(?, position),
          department = COALESCE(?, department),
          salary = COALESCE(?, salary),
          status = COALESCE(?, status),
          updated_at = datetime('now')
        WHERE id = ?`,
        name, email, phone, position, department, salary, status, req.params.id
      );

      const employee = db.get('SELECT * FROM employees WHERE id = ?', req.params.id);
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', (req, res) => {
    const result = db.run('DELETE FROM employees WHERE id = ?', req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  });

  return router;
}
