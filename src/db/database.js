import * as SQLite from 'expo-sqlite';

let _db;

export async function getDb() {
    if (!_db) _db = await SQLite.openDatabaseAsync('citizen.db');
    return _db;
}

/** Ініціалізація (створення + міграція колонок) */
export async function initDb() {
    const db = await getDb();
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // базова таблиця
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS offenses (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                description TEXT NOT NULL,
                                                category TEXT,
                                                image_base64 TEXT,
                                                created_at TEXT NOT NULL
        );
    `);

    const cols = await db.getAllAsync(`PRAGMA table_info(offenses);`);
    const names = cols.map(c => c.name);

    if (!names.includes('photo_url')) {
        await db.execAsync(`ALTER TABLE offenses ADD COLUMN photo_url TEXT;`);
    }
    if (!names.includes('photo_id')) {
        await db.execAsync(`ALTER TABLE offenses ADD COLUMN photo_id TEXT;`);
    }
    if (!names.includes('is_synced')) {
        await db.execAsync(`ALTER TABLE offenses ADD COLUMN is_synced INTEGER DEFAULT 0;`);
    }
}

export async function getAll(sql, params = []) {
    const db = await getDb();
    return db.getAllAsync(sql, params);
}
export async function run(sql, params = []) {
    const db = await getDb();
    return db.runAsync(sql, params);
}
