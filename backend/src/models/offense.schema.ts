import mongoose, { Document, Types } from 'mongoose';

/**
 * OffenseDocument
 *
 * Інтерфейс для Mongo-документа правопорушення.
 * Поля:
 * - _id: ObjectId (ідентифікатор документа)
 * - user: ObjectId → посилання на користувача (ref User)
 * - description: опис правопорушення (обов’язкове)
 * - category: категорія
 * - photoUrl: URL фото у Cloudinary
 * - photoId: ID фото у Cloudinary
 * - latitude / longitude: геокоординати (опціонально)
 * - createdAt: дата створення (обов’язкове поле)
 */
export interface OffenseDocument extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    description: string;
    category?: string;
    photoUrl?: string;
    photoId?: string;
    latitude?: number;
    longitude?: number;
    createdAt: Date;
}

/**
 * Схема OffenseSchema
 *
 * - user: посилання на користувача (обов’язкове, з індексом)
 * - description: текстовий опис (обов’язкове)
 * - category: довільна категорія
 * - photoUrl / photoId: дані про фото у Cloudinary
 * - latitude / longitude: координати місця
 * - createdAt: дата створення (обов’язкове)
 *
 * Налаштування:
 * - timestamps: true → автоматично додає createdAt та updatedAt
 */
const OffenseSchema = new mongoose.Schema<OffenseDocument>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        description: { type: String, required: true },
        category: { type: String },
        photoUrl: { type: String },
        photoId: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        createdAt: { type: Date, required: true },
    },
    { timestamps: true }
);

/**
 * Віртуальне поле `id`
 *
 * Додає зручний доступ до _id як рядка (user.id).
 */
OffenseSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/**
 * Індекс
 *
 * Комбінований індекс за user + createdAt для оптимізації пошуку:
 * - швидкий пошук усіх правопорушень користувача
 * - відсортувати за датою створення (спаданням)
 */
OffenseSchema.index({ user: 1, createdAt: -1 });

/**
 * Модель OffenseModel
 *
 * Відповідає колекції "offenses" у MongoDB.
 */
export const OffenseModel = mongoose.model<OffenseDocument>('Offense', OffenseSchema);
