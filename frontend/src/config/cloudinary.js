/**
 * Конфігурація Cloudinary
 *
 * Використовується для завантаження фото порушень у хмару.
 * - cloudName: назва акаунту Cloudinary
 * - uploadPreset: пресет, налаштований у Cloudinary для завантажень
 * - folder: папка, куди потрапляють файли
 */
export const CLOUDINARY = {
    cloudName: "dctwua7xj",
    uploadPreset: "citizen_offenses",
    folder: "citizen/offenses",
};

/**
 * URL API Cloudinary для завантаження зображень.
 * Формується на основі cloudName.
 */
export const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`;
