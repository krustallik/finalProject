
import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

export async function requireAuth(ctx: Context, next: Next) {
    const header = ctx.get('Authorization'); // "Bearer <token>"
    const token = header?.split(' ')[1];
    if (!token) { ctx.status = 401; ctx.body = { message: 'Unauthorized' }; return; }
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
        ctx.state.userId = payload.sub;
        await next();
    } catch {
        ctx.status = 401; ctx.body = { message: 'Unauthorized' };
    }
}
