import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

/**
 * requireAuth
 *
 * Middleware для захисту маршрутів.
 * Перевіряє наявність і валідність JWT-токена в заголовку `Authorization`.
 *
 * @param {Context} ctx - Koa контекст запиту
 * @param {Next} next - наступний middleware
 */
export async function requireAuth(ctx: Context, next: Next) {
    const header = ctx.get('Authorization'); // очікується "Bearer <token>"
    const token = header?.split(' ')[1];

    if (!token) {
        ctx.status = 401;
        ctx.body = { message: 'Unauthorized' };
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
        ctx.state.userId = payload.sub; // збереження id юзера
        await next();
    } catch {
        ctx.status = 401;
        ctx.body = { message: 'Unauthorized' };
    }
}
