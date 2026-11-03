import { randomBytes } from 'crypto';

const configuredJwtSecret = process.env.JWT_SECRET?.trim();

if (process.env.NODE_ENV === 'production' && (!configuredJwtSecret || configuredJwtSecret.length < 32)) {
    throw new Error('Set JWT_SECRET to a unique value of at least 32 characters before starting in production.');
}

/**
 * Local development can start without a checked-in default signing key.
 * The generated value is intentionally temporary and changes on each restart.
 */
export const JWT_SECRET = configuredJwtSecret || randomBytes(32).toString('hex');

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citizen_offense_demo';
export const PORT = Number(process.env.PORT || 3000);
export const HOST = process.env.HOST || '127.0.0.1';

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
}
