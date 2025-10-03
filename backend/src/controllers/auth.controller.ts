import { Context } from 'koa';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dtos/user.dto';
import { ValidationError } from '../errors/app-err';
import { formatValidationErrors } from '../errors/format';

/**
 * AuthController
 *
 * Обробляє HTTP-запити автентифікації:
 * - реєстрацію нового користувача
 * - вхід користувача
 *
 * Використовує class-validator для перевірки DTO.
 */
@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private auth: AuthService) {}

    /**
     * Реєстрація користувача
     * @route POST /auth/register
     * @param ctx.body { name, email, password }
     * @throws ValidationError якщо DTO невалідний
     */
    async register(ctx: Context) {
        // перетворюємо тіло запиту на DTO
        const dto = plainToInstance(RegisterDto, ctx.request.body);
        const errors = await validate(dto);

        // якщо є помилки → кидаємо ValidationError з деталями
        if (errors.length) {
            throw new ValidationError('Validation failed', formatValidationErrors(errors));
        }

        // передаємо далі у сервіс
        ctx.body = await this.auth.register(dto);
        ctx.status = 201;
    }

    /**
     * Вхід користувача
     * @route POST /auth/login
     * @param ctx.body { email, password }
     * @throws ValidationError якщо DTO невалідний
     */
    async login(ctx: Context) {
        const dto = plainToInstance(LoginDto, ctx.request.body);
        const errors = await validate(dto);

        if (errors.length) {
            throw new ValidationError('Validation failed', formatValidationErrors(errors));
        }

        ctx.body = await this.auth.login(dto);
    }
}
