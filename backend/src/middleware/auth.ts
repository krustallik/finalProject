import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/app-err';
import { JWT_SECRET } from '../config';

/**
 * authGuard
 *
 * Middleware для захисту маршрутів за допомогою JWT.
 *
 *
 * @param {Context} ctx - Koa контекст запиту
 * @param {Next} next - наступний middleware у ланцюжку
 * @throws {AppError} 401, якщо токен відсутній або невалідний
 */
export async function authGuard(ctx: Context, next: Next) {
    const hdr = ctx.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;

    if (!token) throw new AppError('Unauthorized', 401);

    let payload: { sub: string };
    try {
        payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    } catch {
        throw new AppError('Unauthorized', 401);
    }

    // Keep downstream route errors intact; only JWT verification is translated to 401.
    ctx.state.userId = payload.sub;
    await next();
}
