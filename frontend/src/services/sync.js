import { uploadBase64ToCloudinary } from './cloudinary';
import { listPendingLocal, deleteLocalById, createRemoteOffense } from '../repositories/offensesRepo';
import { isOnline } from './network';

export async function syncPendingOffenses() {
    if (!(await isOnline())) return;

    const pending = await listPendingLocal();
    for (const it of pending) {
        try {
            const { secure_url, public_id } = await uploadBase64ToCloudinary(it.image_base64);
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
            await deleteLocalById(it.id);
        } catch (e) {
            console.warn('sync pending failed', it.id, e);
        }
    }
}
