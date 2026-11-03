import { Context, Next } from 'koa';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const MAX_CLIENTS = 20_000;

type Bucket = { count: number; expiresAt: number };
const buckets = new Map<string, Bucket>();
let lastCleanup = 0;

export async function authRateLimit(ctx: Context, next: Next) {
    const now = Date.now();
    if (now - lastCleanup >= 15_000) {
        for (const [ip, bucket] of buckets) {
            if (bucket.expiresAt <= now) buckets.delete(ip);
        }
        lastCleanup = now;
    }

    const key = ctx.ip;
    let bucket = buckets.get(key);
    if (!bucket || bucket.expiresAt <= now) {
        if (buckets.size >= MAX_CLIENTS) {
            ctx.status = 429;
            ctx.body = { message: 'Too many authentication requests. Try again shortly.' };
            return;
        }
        bucket = { count: 0, expiresAt: now + WINDOW_MS };
        buckets.set(key, bucket);
    }

    if (bucket.count >= MAX_REQUESTS) {
        ctx.status = 429;
        ctx.body = { message: 'Too many authentication requests. Try again shortly.' };
        return;
    }

    bucket.count += 1;
    await next();
}