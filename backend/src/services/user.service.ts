import {RegisterDto, UpdateUserDto, UserResponseDto} from "../dtos/user.dto";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserRepository} from "../repositories/user.repository";
import {UserDocument} from "../models/user.schema";
import {ConflictError, NotFoundError} from "../errors/app-err";
import bcrypt from "bcrypt";

/**
 * UserService
 *
 * Сервісний шар для роботи з користувачами.
 * Інкапсулює бізнес-логіку та виклики до репозиторію.
 */
@injectable()
export class UserService {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository
    ) {}

    /**
     * Повернути список усіх користувачів
     * @returns {Promise<UserResponseDto[]>}
     */
    async findAll() {
        const users = await this.userRepository.findAll();
        return users.map(user => toUserResponseDto(user));
    }

    /**
     * Знайти користувача за ID.
     * @param {string} id - ідентифікатор користувача
     * @throws {NotFoundError} якщо користувача не знайдено
     * @returns {Promise<UserResponseDto>}
     */
    async findById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundError(`User with id "${id}" not found`);
        return toUserResponseDto(user, true);
    }

    /**
     * Оновити дані користувача за ID.
     * @param {string} id - ідентифікатор користувача
     * @param {UpdateUserDto} dto - нові дані
     * @throws {NotFoundError} якщо користувача не знайдено
     * @throws {ConflictError} якщо email вже існує
     * @returns {Promise<UserDocument>}
     */
    async updateById(id: string, dto: UpdateUserDto) {
        try {
            const user = await this.userRepository.update(id, dto);
            if (!user) throw new NotFoundError(`User with id "${id}" not found`);
            return user;
        } catch (err: any) {
            if (err.code === 11000 && err.keyPattern?.email) {
                throw new ConflictError(`Email "${dto.email}" already exists`);
            }
            throw err;
        }
    }

    /**
     * Видалити користувача за ID.
     * @param {string} id - ідентифікатор користувача
     * @throws {NotFoundError} якщо користувача не знайдено
     */
    async deleteById(id: string) {
        const user = await this.userRepository.delete(id);
        if (!user) throw new NotFoundError(`User with id "${id}" not found`);
    }
}

/**
 * Перетворення UserDocument → UserResponseDto
 * @param {UserDocument} user - документ користувача
 * @param {boolean} includeEmail - чи включати email в DTO
 * @returns {UserResponseDto}
 */
function toUserResponseDto(user: UserDocument, includeEmail = false): UserResponseDto {
    const dto = {
        id: user.id,
        name: user.name,
    } as UserResponseDto;

    if (includeEmail) {
        dto.email = user.email;
    }
    return dto;
}
