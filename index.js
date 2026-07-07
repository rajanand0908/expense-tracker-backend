const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// GET all expenses
app.get("/expenses", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM expenses ORDER BY date DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST expense
app.post("/expenses", async (req, res) => {
  try {
    const { amount, category, date, note, userId } = req.body;

    const id = uuidv4();

    await db.query(
      `INSERT INTO expenses
      (id, amount, category, date, note, userId)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, amount, category, date, note, userId]
    );

    res.json({
      id,
      amount,
      category,
      date,
      note,
      userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
app.delete("/expenses/:id", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM expenses WHERE id=$1",
      [req.params.id]
    );

    res.json({
      deleted: req.params.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});