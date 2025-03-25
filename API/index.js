const fs = require('fs');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const db = new sqlite3.Database('../../db/dinnersdb.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/recipes', (req, res) => {
    const sql = 'SELECT * FROM recipes';
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});