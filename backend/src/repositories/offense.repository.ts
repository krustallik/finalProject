import { injectable } from 'inversify';
import { OffenseDocument, OffenseModel } from '../models/offense.schema';

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
    async updateById(id: string, patch: Partial<OffenseDocument>) {
        return OffenseModel.findByIdAndUpdate(id, patch, { new: true, projection: { __v: 0 } }).exec();
    }

    /**
     * Повертає всі правопорушення
     */
    async findAll() {
        return OffenseModel.find({}, { __v: 0 })
            .sort({ createdAt: -1 })
            .exec();
    }
}
