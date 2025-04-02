const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Mock database setup
const db = new sqlite3.Database(':memory:'); // Use an in-memory database for testing

// Initialize the database and table
beforeAll((done) => {
    db.run(
      `CREATE TABLE recipes (
        recipeId INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        url TEXT
      )`,
      () => {
        db.run(
          `INSERT INTO recipes (title, url)
           VALUES ('Toast sandwich', 'www.example.com/toast-sandwich')`,
          done
        );
      }
    );
  });

  // Close the database after tests
afterAll((done) => {
    db.close(done);
  });

  // Mock the /recipes route
app.get('/recipes', (req, res) => {
    const sql = 'SELECT * FROM recipes';
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    });
  });

  // Test the /recipes route
describe('GET /recipes', () => {
    it('should return a list of recipes', async () => {
      const response = await request(app).get('/recipes');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          recipeId: 1,
          title: 'Toast sandwich',
          url: 'www.example.com/toast-sandwich',
        },
      ]);
    });
  });