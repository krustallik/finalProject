import { Context, Next } from "koa";
import { AppError } from "../errors/app-err";

/**
 * errorHandler
 *
 * Глобальний middleware для обробки помилок у Koa.
 *
 *
 * @param {Context} ctx - Koa контекст запиту
 * @param {Next} next - наступний middleware у ланцюжку
 */
export async function errorHandler(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err: unknown) {
        const error = err as AppError & { details?: Record<string, string[]> };

        // спеціальна обробка помилок валідації
        const isValidation = error.name === 'ValidationError' && error.details;
        const firstDetail =
            isValidation
                ? Object.values(error.details!).flat()[0] // беремо першу помилку
                : undefined;

        ctx.status = error.statusCode || 500;
        ctx.body = {
            error: error.name || 'InternalServerError',
            message: firstDetail || error.message || 'An unexpected error occurred',
            ...(error.details ? { details: error.details } : {}),
        };

        // логування в консоль для відладки
        console.error(err);
    }
}
