import { getAll, run } from '../db/database';

export async function createLocal({ description, category, imageBase64, createdAt, coords }) {
    const ts = createdAt || new Date().toISOString();
    const lat = coords?.latitude ?? null;
    const lng = coords?.longitude ?? null;

    await run(
        `INSERT INTO offenses (description, category, image_base64, latitude, longitude, created_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, 0);`,
        [description.trim(), (category || '').trim(), imageBase64 || null, lat, lng, ts]
    );
}

export async function createSynced({ description, category, photo_url, photo_id, createdAt, coords }) {
    const ts = createdAt || new Date().toISOString();
    const lat = coords?.latitude ?? null;
    const lng = coords?.longitude ?? null;

    await run(
        `INSERT INTO offenses (description, category, photo_url, photo_id, latitude, longitude, created_at, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1);`,
        [description.trim(), (category || '').trim(), photo_url || null, photo_id || null, lat, lng, ts]
    );
}

export async function listOffenses() {
    return getAll(`SELECT * FROM offenses ORDER BY created_at DESC;`);
}

export async function listPending() {
    return getAll(`SELECT * FROM offenses WHERE is_synced = 0 ORDER BY created_at ASC;`);
}

export async function markSynced(id, { photo_url, photo_id }) {
    await run(
        `UPDATE offenses
         SET is_synced = 1, photo_url = ?, photo_id = ?, image_base64 = NULL
         WHERE id = ?;`,
        [photo_url || null, photo_id || null, id]
    );
}

export async function deleteOffense(id) {
    await run('DELETE FROM offenses WHERE id = ?;', [id]);
}

export async function clearOffenses() {
    await run('DELETE FROM offenses;');
}
