const Database = require('better-sqlite3');
const db = new Database('expenses.db');

db.exec(`DROP TABLE IF EXISTS expenses`);

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category TEXT,
    date TEXT,
    note TEXT,
    userId TEXT
  )
`);

module.exports = db;