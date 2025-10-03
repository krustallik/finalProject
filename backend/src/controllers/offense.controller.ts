import { Context } from 'koa';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { OffenseService } from '../services/offense.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOffenseDto, UpdateOffenseDto } from '../dtos/offense.dto';
import { ValidationError } from '../errors/app-err';
import { formatValidationErrors } from '../errors/format';

/**
 * OffenseController
 *
 * Контролер для роботи з правопорушеннями.
 * Обробляє CRUD-запити:
 * - створення правопорушення
 * - отримання списку власних / всіх правопорушень
 * - оновлення
 * - видалення
 *
 * Використовує class-validator для перевірки DTO.
 */
@injectable()
export class OffenseController {
    constructor(@inject(TYPES.OffenseService) private service: OffenseService) {}

    /**
     * Створення нового правопорушення
     * @route POST /offenses
     * @param ctx.body { description, category, photoUrl?, photoId?, latitude?, longitude?, createdAt }
     * @throws ValidationError якщо DTO невалідний
     */
    async create(ctx: Context) {
        const dto = plainToInstance(CreateOffenseDto, ctx.request.body);
        const errors = await validate(dto);
        if (errors.length) throw new ValidationError('Validation failed', formatValidationErrors(errors));

        const userId = ctx.state.userId as string; // беремо ID з токена
        ctx.body = await this.service.create(userId, dto);
        ctx.status = 201;
    }

    /**
     * Отримати список власних правопорушень
     * @route GET /offenses/mine
     */
    async mine(ctx: Context) {
        const userId = ctx.state.userId as string;
        ctx.body = await this.service.listMine(userId);
    }

    /**
     * Отримати список усіх правопорушень (для адмінів/публічного перегляду)
     * @route GET /offenses/all
     */
    async all(ctx: Context) {
        ctx.body = await this.service.listAll();
    }

    /**
     * Оновити правопорушення
     * @route PATCH /offenses/:id
     * @param ctx.body { description?, category?, ... }
     * @throws ValidationError якщо DTO невалідний
     */
    async update(ctx: Context) {
        const dto = plainToInstance(UpdateOffenseDto, ctx.request.body);
        const errors = await validate(dto, { skipMissingProperties: true });
        if (errors.length) throw new ValidationError('Validation failed', formatValidationErrors(errors));

        const userId = ctx.state.userId as string;
        ctx.body = await this.service.update(userId, ctx.params.id, dto);
    }

    /**
     * Видалити правопорушення
     * @route DELETE /offenses/:id
     */
    async delete(ctx: Context) {
        const userId = ctx.state.userId as string;
        await this.service.remove(userId, ctx.params.id);
        ctx.status = 204;
    }
}
