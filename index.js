const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const authenticate = (req, res, next) => {
    const apiKey = req.header("x-api-key");

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    next();
};

// GET all transactions
app.get('/transactions', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM transactions ORDER BY date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST transaction
app.post('/transactions', authenticate, async (req, res) => {
  try {
    const { id, amount, type, categoryID, accountID, paymentMethod, note, date, createdAt, updatedAt, isDeleted, userId } = req.body;
    await db.query(
      `INSERT INTO transactions
      (id, amount, type, categoryID, accountID, paymentMethod, note, date, createdAt, updatedAt, isDeleted, userId)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [id, amount, type, categoryID, accountID, paymentMethod, note, date, createdAt, updatedAt, isDeleted, userId]
    );
    res.json({ id, amount, type, categoryID, accountID, paymentMethod, note, date, createdAt, updatedAt, isDeleted, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE transaction
app.delete('/transactions/:id', authenticate, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM transactions WHERE id=$1',
      [req.params.id]
    );
    res.json({ deleted: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});