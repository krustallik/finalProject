// Новий API (без /legacy)
import * as SQLite from 'expo-sqlite';

let _db;

/** Повертає singleton БД */
export async function getDb() {
    if (!_db) _db = await SQLite.openDatabaseAsync('citizen.db');
    return _db;
}

/** Ініціалізація таблиць */
export async function initDb() {
    const db = await getDb();
    // (необов’язково) стабільніша робота записів
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS offenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      category TEXT,
      image_base64 TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

export async function getAll(sql, params = []) {
    const db = await getDb();
    return await db.getAllAsync(sql, params);
}

export async function run(sql, params = []) {
    const db = await getDb();
    return await db.runAsync(sql, params);
}
