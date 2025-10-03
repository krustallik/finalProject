import mongoose, { Document, Types } from 'mongoose';

/**
 * UserDocument
 *
 * Інтерфейс для Mongo-документа користувача.
 * Наслідує mongoose.Document і додає поля:
 * - _id: ObjectId
 * - name: ім’я користувача
 * - email: електронна пошта (унікальна)
 * - passwordHash: хешований пароль
 */
export interface UserDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
}

/**
 * Схема UserSchema
 *
 * Містить базову інформацію про користувача:
 * - name (обов’язкове поле)
 * - email (обов’язкове, унікальне)
 * - passwordHash (обов’язкове, збережений хеш пароля)
 *
 * Налаштування:
 * - timestamps: true → додає createdAt і updatedAt
 */
const UserSchema = new mongoose.Schema<UserDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true }
);

/**
 * Віртуальне поле `id`
 *
 * Додає зручний геттер для доступу до рядкового значення _id.
 * Тепер можна використовувати `user.id` замість `user._id.toHexString()`.
 */
UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/**
 * Модель UserModel
 *
 * Відповідає колекції "users" у MongoDB.
 */
export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
