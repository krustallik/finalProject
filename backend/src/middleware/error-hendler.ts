import {Context, Next} from "koa";
import {AppError} from "../errors/app-err";

export async function errorHandler(ctx: Context, next: Next){
    try {
        await next();
    }catch (err: unknown){
        const error = err as AppError & { details?: any };
        ctx.status = error.statusCode || 500;
        ctx.body = {
            error: error.name || 'InternalSeverError',
            message: error.message || 'An unexpected error occurred',
            ...(error.details ? { details: error.details } : {})
        }
        console.error(err);
    }
}