import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { OffenseDocument, OffenseModel } from '../models/offense.schema';
import type { PublicOffenseCursor } from '../utils/offense-pagination';

/**
 * OffenseRepository
 *
 * Репозиторій для роботи з колекцією Offenses у MongoDB.
 * Інкапсулює всі CRUD операції:
 * - створення
 * - пошук по id / користувачу / всіх
 * - оновлення
 * - видалення
 */
@injectable()
export class OffenseRepository {
    /**
     * Створює новий документ Offense
     * @param doc - часткові дані правопорушення
     */
    async create(doc: Partial<OffenseDocument>) {
        const m = new OffenseModel(doc);
        return m.save();
    }

    /**
     * Знаходить документ за його id
     * @param id - ідентифікатор
     */
    async findById(id: string) {
        return OffenseModel.findById(id, { __v: 0 }).exec();
    }

    /**
     * Знаходить усі правопорушення користувача
     * @param userId - ідентифікатор користувача
     */
    async findAllByUser(userId: string) {
        return OffenseModel.find({ user: userId }, { __v: 0 })
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Видаляє правопорушення за id
     * @param id - ідентифікатор документа
     */
    async deleteById(id: string) {
        return OffenseModel.findByIdAndDelete(id, { projection: { __v: 0 } }).exec();
    }

    /**
     * Оновлює документ правопорушення
     * @param id - ідентифікатор
     * @param patch - дані для оновлення
     */
    async updateByIdForUser(id: string, userId: string, patch: Partial<OffenseDocument>) {
        return OffenseModel.findOneAndUpdate(
            { _id: id, user: userId },
            patch,
            { new: true, projection: { __v: 0 } }
        ).exec();
    }

    /**
     * Повертає всі правопорушення
     */
    async findAll(limit: number, cursor?: PublicOffenseCursor) {
        const filter = cursor
            ? {
                $or: [
                    { createdAt: { $lt: cursor.createdAt } },
                    { createdAt: cursor.createdAt, _id: { $lt: new Types.ObjectId(cursor.id) } },
                ],
            }
            : {};

        return OffenseModel.find(filter, { __v: 0 })
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit)
            .exec();
    }
}
