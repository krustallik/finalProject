import { UserDocument, UserModel } from "../models/user.schema";
import { UpdateUserDto } from "../dtos/user.dto";
import { injectable } from "inversify";

/**
 * UserRepository
 *
 * Репозиторій для роботи з користувачами у MongoDB.
 * Інкапсулює CRUD операції:
 * - пошук усіх користувачів
 * - пошук за id чи email
 * - створення з хешованим паролем
 * - оновлення
 * - видалення
 */
@injectable()
export class UserRepository {
    /**
     * Отримати список усіх користувачів
     */
    async findAll(): Promise<UserDocument[]> {
        return UserModel.find({}, { __v: 0 }).exec();
    }

    /**
     * Знайти користувача за id
     * @param id - ідентифікатор користувача
     */
    async findById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id, { __v: 0 }).exec();
    }

    /**
     * Оновити дані користувача
     * @param id - ідентифікатор
     * @param dto - дані для оновлення
     */
    async update(id: string, dto: UpdateUserDto): Promise<UserDocument | null> {
        return UserModel.findByIdAndUpdate(id, dto, {
            new: true,
            projection: { __v: 0 },
        }).exec();
    }

    /**
     * Видалити користувача
     * @param id - ідентифікатор
     */
    async delete(id: string): Promise<UserDocument | null> {
        return UserModel.findByIdAndDelete(id, { projection: { __v: 0 } }).exec();
    }

    /**
     * Знайти користувача за email
     * @param email - пошта
     */
    async findByEmail(email: string) {
        return UserModel.findOne({ email }, { __v: 0 }).exec();
    }

    /**
     * Створити нового користувача з уже хешованим паролем
     * @param doc - ім’я, email і хеш пароля
     */
    async createWithHash(doc: { name: string; email: string; passwordHash: string }) {
        const user = new UserModel(doc);
        return user.save();
    }
}
