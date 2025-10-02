import * as SQLite from 'expo-sqlite';

let _db;

/**
 * Повертає (і відкриває при першому виклику) екземпляр БД.
 * Використовується як Singleton — один інстанс на весь застосунок.
 */
async function getDb() {
    if (!_db) _db = await SQLite.openDatabaseAsync('citizen.db');
    return _db;
}

/**
 * Ініціалізація бази даних:
 * - вмикає WAL (Write-Ahead Logging) для кращої продуктивності
 * - створює таблицю `offenses`, якщо вона ще не існує
 */
export async function initDb() {
    const db = await getDb();
    await db.execAsync('PRAGMA journal_mode = WAL;');

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

}

/**
 * Виконує SELECT-запит і повертає всі результати.
 * @param {string} sql - SQL запит
 * @param {any[]} params - параметри запиту
 */
export async function getAll(sql, params = []) {
    const db = await getDb();
    return await db.getAllAsync(sql, params);
}

/**
 * Виконує будь-який SQL (INSERT/UPDATE/DELETE).
 * @param {string} sql - SQL запит
 * @param {any[]} params - параметри запиту
 */
export async function run(sql, params = []) {
    const db = await getDb();
    return await db.runAsync(sql, params);
}
