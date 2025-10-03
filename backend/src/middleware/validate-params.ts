import { Context, Next } from 'koa';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from '../errors/app-err';
import { formatValidationErrors } from '../errors/format';

/**
 * validateParams
 *
 * Middleware-фабрика для валідації параметрів маршруту (ctx.params).
 * Використовує class-transformer + class-validator.
 *
 * @param {any} DtoClass - клас DTO з декораторами class-validator
 * @returns {function} Koa middleware для перевірки параметрів
 */
export function validateParams(DtoClass: any) {
    return async (ctx: Context, next: Next) => {
        // трансформуємо params у DTO
        const dto = plainToInstance(DtoClass, ctx.params);
        // запускаємо валідацію
        const errors = await validate(dto);

        if (errors.length) {
            // форматуємо помилки й кидаємо
            throw new ValidationError('Invalid parameters', formatValidationErrors(errors));
        }

        await next();
    };
}
