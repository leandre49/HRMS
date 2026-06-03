import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, '..', 'dab_enterprise.db');

let db = null;

export async function initDatabase() {
  const SQL = await initSqlJs();

  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      salary REAL NOT NULL,
      hire_date TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL,
      supplier TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_cost REAL NOT NULL,
      purchase_date TEXT NOT NULL,
      employee_id INTEGER,
      status TEXT DEFAULT 'completed',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_amount REAL NOT NULL,
      sale_date TEXT NOT NULL,
      employee_id INTEGER,
      status TEXT DEFAULT 'completed',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    );
  `);

  const count = db.exec('SELECT COUNT(*) as cnt FROM categories');
  const rows = count.length > 0 ? count[0].values : [];
  if (rows.length === 0 || rows[0][0] === 0) {
    const categories = [
      ['Cement & Concrete', 'Cement, concrete blocks, and related products'],
      ['Steel & Reinforcement', 'Steel bars, rods, and reinforcement materials'],
      ['Roofing Materials', 'Roofing sheets, tiles, and accessories'],
      ['Plumbing', 'Pipes, fittings, and plumbing supplies'],
      ['Electrical', 'Wires, switches, and electrical fittings'],
      ['Paint & Finishes', 'Paint, varnish, and finishing materials'],
      ['Tools & Hardware', 'Hand tools, power tools, and hardware'],
      ['Wood & Lumber', 'Timber, plywood, and wood products'],
      ['Tiles & Flooring', 'Floor and wall tiles, adhesives'],
      ['Sanitary Ware', 'Toilets, sinks, and bathroom fixtures'],
    ];
    const stmt = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
    for (const [name, desc] of categories) {
      stmt.run([name, desc]);
    }
    stmt.free();
  }

  saveDatabase();
  return db;
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
  }
}

export function getDb() {
  return db;
}

export default { initDatabase, saveDatabase, getDb };
