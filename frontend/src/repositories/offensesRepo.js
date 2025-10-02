import { getAllOffenses, postOffense, deleteOffenseRemote } from '../api/offenses';
import { run, getAll } from '../db/database';

/**
 * Репозиторій порушень (Offenses Repository)
 *
 * Інкапсулює доступ до даних:
 * - Онлайн: HTTP-API (отримання/створення/видалення)
 * - Офлайн: SQLite (черга на синхронізацію)
 *
 * Примітка:
 * - Для офлайн-записів фото зберігається як image_base64; після успішного синку рядок видаляється.
 */

// -------- онлайнові --------

/**
 * Отримати всі порушення (всіх користувачів).
 * @returns {Promise<Array>} список порушень
 */
export async function listOffensesRemoteAll() {
    return await getAllOffenses();
}

/**
 * Створити порушення на сервері.
 * @param {Object} args
 * @param {string} args.description
 * @param {string} [args.category]
 * @param {string} args.createdAt  ISO-рядок
 * @param {{latitude?:number, longitude?:number}} [args.coords]
 * @param {string} [args.photoUrl]  URL зображення у хмарі
 * @param {string} [args.photoId]   ідентифікатор у хмарі
 */
export async function createRemoteOffense({ description, category, createdAt, coords, photoUrl, photoId }) {
    return await postOffense({
        description,
        category,
        createdAt,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        photoUrl,
        photoId,
    });
}

/**
 * Видалити порушення на сервері за id.
 * @param {string|number} id
 */
export async function deleteOffenseRemoteById(id) {
    await deleteOffenseRemote(String(id));
}

// -------- офлайн (для синку) --------

/**
 * Створити офлайн-запис порушення в локальній БД (image_base64 → черга на синк).
 * @param {Object} args
 * @param {string} args.description
 * @param {string} [args.category]
 * @param {string} [args.imageBase64]   base64-зображення (наявність означає "потрібно синкнути")
 * @param {string} [args.createdAt]     ISO-час створення (дефолт: now)
 * @param {{latitude?:number, longitude?:number}} [args.coords]
 */
export async function createLocalOffense({ description, category, imageBase64, createdAt, coords }) {
    await run(
        `INSERT INTO offenses (description, category, image_base64, latitude, longitude, created_at)
         VALUES (?,?,?,?,?,?)`,
        [
            description.trim(),
            (category || '').trim(),
            imageBase64 || null,
            coords?.latitude ?? null,
            coords?.longitude ?? null,
            createdAt || new Date().toISOString(),
        ]
    );
}

/**
 * Повернути офлайн-записи, що очікують синхронізації
 * (фільтр по image_base64 != null/empty).
 * Відсортовано за created_at ASC (старіші — першими).
 */
export async function listPendingLocal() {
    return await getAll(
        `SELECT * FROM offenses
         WHERE image_base64 IS NOT NULL AND image_base64 != ''
         ORDER BY created_at ASC`
    );
}

/**
 * Видалити локальний запис за id (після успішного синку).
 * @param {number} id
 */
export async function deleteLocalById(id) {
    await run(`DELETE FROM offenses WHERE id = ?`, [id]);
}
