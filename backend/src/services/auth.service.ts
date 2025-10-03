import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { UserRepository } from '../repositories/user.repository';
import { ConflictError, NotFoundError, AppError } from '../errors/app-err';
import { RegisterDto, LoginDto } from '../dtos/user.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

/**
 * AuthService
 *
 * Відповідає за автентифікацію та реєстрацію користувачів:
 * - реєстрація (створення користувача з хешованим паролем)
 * - вхід (перевірка email/паролю)
 * - видача JWT токена
 */
@injectable()
export class AuthService {
    constructor(@inject(TYPES.UserRepository) private repo: UserRepository) {}

    /**
     * Реєстрація нового користувача
     * @param dto - дані для реєстрації (імʼя, email, пароль)
     * @throws ConflictError якщо email вже існує
     * @returns { user, token } - створений користувач та JWT токен
     */
    async register(dto: RegisterDto) {
        const exists = await this.repo.findByEmail(dto.email);
        if (exists) throw new ConflictError(`Email "${dto.email}" already exists`);

        // Хешування паролю
        const passwordHash = await bcrypt.hash(dto.password, 10);

        // Створення користувача
        const user = await this.repo.createWithHash({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });

        // Генерація токена
        const token = this.issueJwt(user.id);

        return { user: { id: user.id, name: user.name, email: user.email }, token };
    }

    /**
     * Вхід користувача
     * @param dto - email та пароль
     * @throws NotFoundError якщо користувача з таким email немає
     * @throws AppError якщо пароль не співпадає
     * @returns { user, token } - користувач та JWT токен
     */
    async login(dto: LoginDto) {
        const user = await this.repo.findByEmail(dto.email);
        if (!user) throw new NotFoundError(`User with email "${dto.email}" not found`);

        // Перевірка паролю
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) throw new AppError('Invalid credentials', 401);

        // Генерація токена
        const token = this.issueJwt(user.id);

        return { user: { id: user.id, name: user.name, email: user.email }, token };
    }

    /**
     * Видача JWT токена
     * @param userId - ідентифікатор користувача
     */
    private issueJwt(userId: string) {
        return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
    }
}
