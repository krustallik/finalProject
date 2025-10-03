import { Context } from "koa";
import { plainToInstance } from "class-transformer";
import { RegisterDto, UpdateUserDto } from "../dtos/user.dto";
import { validate } from "class-validator";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { UserService } from "../services/user.service";
import { formatValidationErrors } from "../errors/format";
import { ValidationError } from "../errors/app-err";

/**
 * UserController
 *
 * Контролер для роботи з користувачами.
 * Обробляє CRUD-запити:
 * - отримати список користувачів
 * - отримати одного користувача
 * - оновити дані користувача
 * - видалити користувача
 *
 * Використовує class-validator для перевірки DTO.
 */
@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    /**
     * Отримати список усіх користувачів (без email).
     * @route GET /users
     */
    async findAll(ctx: Context) {
        ctx.body = await this.userService.findAll();
    }

    /**
     * Отримати дані конкретного користувача за ID.
     * @route GET /users/:id
     */
    async findOne(ctx: Context) {
        const id = ctx.params.id;
        ctx.body = await this.userService.findById(id);
    }

    /**
     * Оновити користувача.
     * @route PATCH /users/:id
     * @param ctx.body { name?, email? }
     * @throws ValidationError якщо дані невалідні
     */
    async update(ctx: Context) {
        const id = ctx.params.id;
        const dto = plainToInstance(UpdateUserDto, ctx.request.body);

        const errors = await validate(dto, { skipMissingProperties: true });
        if (errors.length) {
            throw new ValidationError("Validation failed", formatValidationErrors(errors));
        }

        ctx.body = await this.userService.updateById(id, dto);
    }

    /**
     * Видалити користувача.
     * @route DELETE /users/:id
     */
    async delete(ctx: Context) {
        const id = ctx.params.id;
        await this.userService.deleteById(id);
        ctx.status = 204;
    }
}
