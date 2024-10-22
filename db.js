const sqlite3 = require('sqlite3').verbose();
const path = require ("path")
const db = new sqlite3.Database('./expenses.db');

db.serialize(() => {
    
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT, 
    type TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    type TEXT, 
    category TEXT, 
    amount REAL, 
    date TEXT, 
    description TEXT
  )`);
});

module.exports = db;