// src/repositories/offensesRepo.js
import { getAllOffenses, getMyOffenses, postOffense, deleteOffenseRemote } from '../api/offenses';
import { run, getAll } from '../db/database';

// -------- онлайнові --------
export async function listOffensesRemoteAll() {
    return await getAllOffenses();
}
export async function listOffensesRemoteMine() {
    return await getMyOffenses();
}
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
export async function deleteOffenseRemoteById(id) {
    await deleteOffenseRemote(String(id));
}

// -------- офлайн (для синку) --------
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

export async function listPendingLocal() {
    return await getAll(`SELECT * FROM offenses WHERE image_base64 IS NOT NULL AND image_base64 != '' ORDER BY created_at ASC`);
}

export async function deleteLocalById(id) {
    await run(`DELETE FROM offenses WHERE id = ?`, [id]);
}
