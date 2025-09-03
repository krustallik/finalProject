import { getAll, run } from '../db/database';

export async function createOffense({ description, category, imageBase64 }) {
    const now = new Date().toISOString();
    await run(
        'INSERT INTO offenses (description, category, image_base64, created_at) VALUES (?, ?, ?, ?);',
        [description.trim(), (category || '').trim(), imageBase64 || null, now]
    );
}

export async function listOffenses() {
    return await getAll('SELECT * FROM offenses ORDER BY created_at DESC;');
}

export async function clearOffenses() {
    await run('DELETE FROM offenses;');
}

export async function deleteOffense(id) {
    await run('DELETE FROM offenses WHERE id = ?;', [id]);
}