const express = require('express');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// GET all expenses
app.get('/expenses', (req, res) => {
  const expenses = db.prepare('SELECT * FROM expenses').all();
  res.json(expenses);
});

const { v4: uuidv4 } = require('uuid');

app.post('/expenses', (req, res) => {
  const { amount, category, date, note, userId } = req.body;
  const id = uuidv4();
  const stmt = db.prepare(
    'INSERT INTO expenses (id, amount, category, date, note, userId) VALUES (?, ?, ?, ?, ?, ?)'
  );
  stmt.run(id, amount, category, date, note, userId);
  res.json({ id, amount, category, date, note, userId });
});

// DELETE expense by id
app.delete('/expenses/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
  stmt.run(req.params.id);
  res.json({ deleted: req.params.id });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});