import express from 'express';
import cors from 'cors';
import { initDatabase, saveDatabase, getDb } from './database.js';
import employeeRoutes from './routes/employees.js';
import purchaseRoutes from './routes/purchases.js';
import saleRoutes from './routes/sales.js';
import reportRoutes from './routes/reports.js';
import categoryRoutes from './routes/categories.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = await initDatabase();

// Helper to wrap db methods for convenience
const dbh = {
  prepare(sql) {
    return { stmt: db.prepare(sql), sql };
  },
  all(sql, ...params) {
    const stmt = db.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  },
  get(sql, ...params) {
    const stmt = db.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    const result = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return result;
  },
  run(sql, ...params) {
    const stmt = db.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    stmt.step();
    stmt.free();
    const lastId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    const changes = db.getRowsModified();
    saveDatabase();
    return { lastInsertRowid: lastId, changes };
  },
  exec(sql) {
    const result = db.exec(sql);
    saveDatabase();
    return result;
  }
};

app.use('/api/employees', employeeRoutes(dbh));
app.use('/api/purchases', purchaseRoutes(dbh));
app.use('/api/sales', saleRoutes(dbh));
app.use('/api/reports', reportRoutes(dbh));
app.use('/api/categories', categoryRoutes(dbh));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`DAB Enterprise API running on http://localhost:${PORT}`);
});
