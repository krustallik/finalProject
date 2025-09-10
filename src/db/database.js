import * as SQLite from 'expo-sqlite';

let _db;
async function getDb() {
    if (!_db) _db = await SQLite.openDatabaseAsync('citizen.db');
    return _db;
}

export async function initDb() {
    const db = await getDb();
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // Створення таблиці, якщо її ще немає (вже з колонками гео)
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS offenses (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                description TEXT NOT NULL,
                                                category TEXT,
                                                image_base64 TEXT,
                                                latitude REAL,
                                                longitude REAL,
                                                created_at TEXT NOT NULL
        );
    `);

    try { await db.execAsync(`ALTER TABLE offenses ADD COLUMN latitude REAL;`); } catch {}
    try { await db.execAsync(`ALTER TABLE offenses ADD COLUMN longitude REAL;`); } catch {}
}

export async function getAll(sql, params = []) {
    const db = await getDb();
    return await db.getAllAsync(sql, params);
}
export async function run(sql, params = []) {
    const db = await getDb();
    return await db.runAsync(sql, params);
}
