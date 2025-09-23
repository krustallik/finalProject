import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/app-err';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export async function authGuard(ctx: Context, next: Next) {
    const hdr = ctx.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;

    if (!token) throw new AppError('Unauthorized', 401);

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
        ctx.state.userId = payload.sub; // <-- тут зберігаємо id юзера
        await next();
    } catch {
        throw new AppError('Unauthorized', 401);
    }
}
