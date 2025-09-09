import { listPending, markSynced } from '../repositories/offensesRepo';
import { uploadBase64ToCloudinary } from './cloudinary';

export async function syncPendingOffenses() {
    const items = await listPending();
    for (const it of items) {
        if (!it.image_base64) continue;
        try {
            const { secure_url, public_id } = await uploadBase64ToCloudinary(it.image_base64);

            await markSynced(it.id, { photo_url: secure_url, photo_id: public_id });
        } catch (e) {
            console.warn('Sync fail id=', it.id, e.message);
        }
    }
}
