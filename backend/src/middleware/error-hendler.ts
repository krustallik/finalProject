
import {Context, Next} from "koa";
import {AppError} from "../errors/app-err";

export async function errorHandler(ctx: Context, next: Next){
    try {
        await next();
    } catch (err: unknown) {
        const error = err as AppError & { details?: Record<string, string[]> };
        const isValidation = error.name === 'ValidationError' && error.details;

        const firstDetail =
            isValidation
                ? Object.values(error.details!).flat()[0]
                : undefined;

        ctx.status = error.statusCode || 500;
        ctx.body = {
            error: error.name || 'InternalServerError',
            message: firstDetail || error.message || 'An unexpected error occurred',
            ...(error.details ? { details: error.details } : {}),
        };
        console.error(err);
    }
}