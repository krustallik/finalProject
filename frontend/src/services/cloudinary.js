import { CLOUDINARY, CLOUDINARY_UPLOAD_URL } from '../config/cloudinary';

/**
 * Перевірка конфігурації Cloudinary.
 * Кидає помилку, якщо не задано cloudName або uploadPreset.
 */
function ensureConfig() {
    if (!CLOUDINARY.cloudName || !CLOUDINARY.uploadPreset) {
        throw new Error('Cloudinary config missing (cloudName/uploadPreset).');
    }
}

/**
 * Завантаження зображення (base64) у Cloudinary.
 *
 * @async
 * @param {string} base64 - Base64-код зображення (без префікса data:image/jpeg;base64)
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 * - secure_url: повний URL до зображення в Cloudinary
 * - public_id: унікальний ідентифікатор файлу в хмарі
 *
 * Використання:
 * ```js
 * const { secure_url, public_id } = await uploadBase64ToCloudinary(base64);
 * ```
 */
export async function uploadBase64ToCloudinary(base64) {
    ensureConfig();

    // Формуємо multipart/form-data запит
    const form = new FormData();
    form.append('file', `data:image/jpeg;base64,${base64}`);
    form.append('upload_preset', CLOUDINARY.uploadPreset);
    if (CLOUDINARY.folder) form.append('folder', CLOUDINARY.folder);

    // Відправляємо у Cloudinary
    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: form });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
    }

    // Успіх → повертаємо URL та ID
    const json = await res.json();
    return { secure_url: json.secure_url, public_id: json.public_id };
}
