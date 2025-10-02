import { api } from './api';

/**
 * Створити нове правопорушення (онлайн).
 * @param {Object} payload - дані про правопорушення
 * @param {string} payload.description - опис
 * @param {string} [payload.category] - категорія
 * @param {string} [payload.photoUrl] - посилання на фото (Cloudinary)
 * @param {string} [payload.photoId] - ID фото у Cloudinary
 * @param {number} [payload.latitude] - широта
 * @param {number} [payload.longitude] - довгота
 * @param {string} payload.createdAt - час створення (ISO)
 * @returns {Promise<Object>} відповідь із сервера (створений об'єкт)
 */
export async function postOffense(payload) {
    const { data } = await api.post('/offenses', {
        description: payload.description,
        category: payload.category,
        photoUrl: payload.photoUrl,
        photoId: payload.photoId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        createdAt: payload.createdAt,
    });
    return data;
}

/**
 * Отримати список усіх правопорушень (публічні).
 * @returns {Promise<Object[]>} масив правопорушень
 */
export async function getAllOffenses() {
    const { data } = await api.get('/offenses/all');
    return data;
}

/**
 * Видалити правопорушення на сервері.
 * @param {string|number} id - ID правопорушення
 * @returns {Promise<void>}
 */
export async function deleteOffenseRemote(id) {
    await api.delete(`/offenses/${id}`);
}
