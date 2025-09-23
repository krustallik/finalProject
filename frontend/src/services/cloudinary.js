import { CLOUDINARY, CLOUDINARY_UPLOAD_URL } from '../config/cloudinary';

function ensureConfig() {
    if (!CLOUDINARY.cloudName || !CLOUDINARY.uploadPreset) {
        throw new Error('Cloudinary config missing (cloudName/uploadPreset).');
    }
}

export async function uploadBase64ToCloudinary(base64) {
    ensureConfig();
    const form = new FormData();
    form.append('file', `data:image/jpeg;base64,${base64}`);
    form.append('upload_preset', CLOUDINARY.uploadPreset);
    if (CLOUDINARY.folder) form.append('folder', CLOUDINARY.folder);

    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: form });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    return { secure_url: json.secure_url, public_id: json.public_id };
}
