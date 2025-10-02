import { uploadBase64ToCloudinary } from './cloudinary';
import { listPendingLocal, deleteLocalById, createRemoteOffense } from '../repositories/offensesRepo';
import { isOnline } from './network';

/**
 * Синхронізує всі локальні правопорушення (offline-збережені) з сервером.
 *
 * @async
 * @returns {Promise<void>}
 */

export async function syncPendingOffenses() {
    if (!(await isOnline())) return; // якщо офлайн → нічого не робимо

    const pending = await listPendingLocal();
    for (const it of pending) {
        try {
            // 1. Завантаження фото у Cloudinary
            const { secure_url, public_id } = await uploadBase64ToCloudinary(it.image_base64);

            // 2. Створюємо запис у віддаленій БД
            await createRemoteOffense({
                description: it.description,
                category: it.category || undefined,
                createdAt: it.created_at,
                coords:
                    it.latitude != null && it.longitude != null
                        ? { latitude: it.latitude, longitude: it.longitude }
                        : undefined,
                photoUrl: secure_url,
                photoId: public_id,
            });

            // 3. Видаляємо локальний (бо вже успішно синкнули)
            await deleteLocalById(it.id);
        } catch (e) {
            console.warn('sync pending failed', it.id, e);
        }
    }
}
