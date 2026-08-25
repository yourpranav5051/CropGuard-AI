/**
 * Database setup — SQLite via better-sqlite3 (synchronous, no async
 * boilerplate needed for a project this size).
 *
 * Swap to Postgres/MySQL later by replacing this file's exports with a
 * different driver — routes only call the functions exported below, so
 * they don't need to change.
 */
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "cropguard.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS disease_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    crop_name TEXT NOT NULL,
    image_path TEXT NOT NULL,
    predicted_disease TEXT,
    confidence REAL,
    severity TEXT,
    recommendation TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = db;
