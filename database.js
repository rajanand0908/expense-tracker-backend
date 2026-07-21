const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY,
        amount DOUBLE PRECISION NOT NULL,
        category TEXT,
        date TEXT,
        note TEXT,
        userId TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY,
        amount DOUBLE PRECISION NOT NULL,
        type TEXT,
        categoryID UUID,
        accountID UUID,
        paymentMethod TEXT,
        note TEXT,
        date TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        isDeleted BOOLEAN DEFAULT false,
        userId TEXT
      );
    `);

    console.log("✅ PostgreSQL connected");
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
}

initializeDatabase();
module.exports = pool;