/**
 * Database setup — SQLite via sql.js (pure JavaScript, no native
 * compilation required).
 *
 * Because sql.js needs an async init step (loading the WASM binary),
 * this module exports a **Promise** that resolves to a thin wrapper
 * whose API matches the better-sqlite3 surface the rest of the app uses:
 *   db.exec(sql)
 *   db.prepare(sql).get(...params)   -> single row or undefined
 *   db.prepare(sql).all(...params)   -> array of rows
 *   db.prepare(sql).run(...params)   -> { lastInsertRowid }
 *
 * Swap to Postgres/MySQL later by replacing this file's exports with a
 * different driver — routes only call the functions exported below, so
 * they don't need to change.
 */
const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "cropguard.db");

/** Persist the in-memory database back to disk. */
function save(sqlDb) {
  const data = sqlDb.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

/**
 * Thin wrapper that mimics the better-sqlite3 API surface used by the app.
 */
function createWrapper(sqlDb) {
  const wrapper = {
    exec(sql) {
      sqlDb.run(sql);
      save(sqlDb);
    },

    prepare(sql) {
      return {
        get(...params) {
          const stmt = sqlDb.prepare(sql);
          stmt.bind(params);
          if (stmt.step()) {
            const cols = stmt.getColumnNames();
            const vals = stmt.get();
            const row = {};
            cols.forEach((c, i) => (row[c] = vals[i]));
            stmt.free();
            return row;
          }
          stmt.free();
          return undefined;
        },

        all(...params) {
          const rows = [];
          const stmt = sqlDb.prepare(sql);
          stmt.bind(params);
          while (stmt.step()) {
            const cols = stmt.getColumnNames();
            const vals = stmt.get();
            const row = {};
            cols.forEach((c, i) => (row[c] = vals[i]));
            rows.push(row);
          }
          stmt.free();
          return rows;
        },

        run(...params) {
          sqlDb.run(sql, params);
          const lastId = sqlDb.exec("SELECT last_insert_rowid() AS id");
          save(sqlDb);
          return {
            lastInsertRowid:
              lastId.length > 0 ? lastId[0].values[0][0] : null,
          };
        },
      };
    },
  };

  return wrapper;
}

const dbReady = (async () => {
  const SQL = await initSqlJs();

  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    sqlDb = new SQL.Database(fileBuffer);
  } else {
    sqlDb = new SQL.Database();
  }

  const db = createWrapper(sqlDb);

  // Create tables (idempotent)
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

  return db;
})();

module.exports = dbReady;
