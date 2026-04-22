const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.SQLITE_PATH || path.join(__dirname, '../data/database.sqlite');

let db = null;

function initSQLite() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ SQLite open error:', err.message);
        return reject(err);
      }
      console.log('✅ SQLite connected:', DB_PATH);
    });

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS restrooms (
          _id TEXT PRIMARY KEY,
          name TEXT,
          building TEXT NOT NULL,
          floor TEXT NOT NULL,
          description TEXT,
          lat REAL,
          lng REAL,
          averageRating REAL DEFAULT 0,
          totalReviews INTEGER DEFAULT 0,
          pooperScore REAL DEFAULT 0,
          cleanliness REAL DEFAULT 0,
          redAlert INTEGER DEFAULT 0,
          redAlertCount INTEGER DEFAULT 0,
          noFlushCount INTEGER DEFAULT 0,
          lastUpdated TEXT,
          createdAt TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS metadata (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `);

      db.run(`
        INSERT OR IGNORE INTO metadata (key, value) VALUES ('nextId', '1')
      `, () => {
        resolve(db);
      });
    });
  });
}

function getDB() {
  return db;
}

function closeDB() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { initSQLite, getDB, closeDB };
