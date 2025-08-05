const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 8080; // یا هر عدد دلخواه دیگر
app.use(express.json());

const db = new sqlite3.Database('cable_tests.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY,
    date TEXT,
    time TEXT,
    productType TEXT,
    productSize TEXT,
    reelNumber TEXT,
    length TEXT,
    orderNumber TEXT,
    cardNumber TEXT,
    voltage TEXT,
    continuity TEXT,
    insulation TEXT,
    inspector TEXT,
    shift TEXT
  )`);
});

app.get('/api/tests', (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: 'Date is required' });
  db.all("SELECT * FROM tests WHERE date = ?", [date], (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows);
  });
});

app.post('/api/tests', (req, res) => {
  const data = req.body;
  const { date, time, productType, productSize, reelNumber, length,
    orderNumber, cardNumber, voltage, continuity, insulation, inspector, shift } = data;

  const sql = `INSERT INTO tests (date, time, productType, productSize, reelNumber, length,
    orderNumber, cardNumber, voltage, continuity, insulation, inspector, shift)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [date, time, productType, productSize, reelNumber, length, orderNumber,
    cardNumber, voltage, continuity, insulation, inspector, shift], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
