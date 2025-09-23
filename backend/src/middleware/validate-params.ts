import { Context, Next } from 'koa';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from '../errors/app-err';
import { formatValidationErrors } from '../errors/format';

export function validateParams(DtoClass: any) {
    return async (ctx: Context, next: Next) => {
        const dto = plainToInstance(DtoClass, ctx.params);
        const errors = await validate(dto);

        if (errors.length) {
            throw new ValidationError('Invalid parameters', formatValidationErrors(errors));
        }

        await next();
    };
}
