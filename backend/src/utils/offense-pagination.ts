import { ValidationError } from '../errors/app-err';

export const DEFAULT_PUBLIC_OFFENSE_PAGE_SIZE = 50;
export const MAX_PUBLIC_OFFENSE_PAGE_SIZE = 100;

export interface PublicOffenseCursor {
    createdAt: Date;
    id: string;
}

export function parsePublicOffenseListQuery(limitValue: unknown, cursorValue: unknown) {
    let limit = DEFAULT_PUBLIC_OFFENSE_PAGE_SIZE;
    if (limitValue !== undefined) {
        if (typeof limitValue !== 'string' || !/^[1-9]\d*$/.test(limitValue)) {
            throw new ValidationError('Invalid report list limit');
        }
        limit = Number(limitValue);
        if (!Number.isSafeInteger(limit) || limit > MAX_PUBLIC_OFFENSE_PAGE_SIZE) {
            throw new ValidationError(`Report list limit must be between 1 and ${MAX_PUBLIC_OFFENSE_PAGE_SIZE}`);
        }
    }

    let cursor: string | undefined;
    if (cursorValue !== undefined) {
        if (typeof cursorValue !== 'string' || cursorValue.length > 256 || !/^[A-Za-z0-9_-]+$/.test(cursorValue)) {
            throw new ValidationError('Invalid report list cursor');
        }
        cursor = cursorValue;
    }

    return { limit, cursor };
}

export function encodePublicOffenseCursor(createdAt: Date, id: string): string {
    return Buffer.from(JSON.stringify({ createdAt: createdAt.toISOString(), id }), 'utf8').toString('base64url');
}

export function decodePublicOffenseCursor(value: string): PublicOffenseCursor {
    try {
        const decoded: unknown = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
        if (!decoded || typeof decoded !== 'object') throw new Error('Invalid cursor payload');

        const payload = decoded as { createdAt?: unknown; id?: unknown };
        if (typeof payload.createdAt !== 'string' || typeof payload.id !== 'string' || !/^[a-f\d]{24}$/i.test(payload.id)) {
            throw new Error('Invalid cursor fields');
        }

        const createdAt = new Date(payload.createdAt);
        if (!Number.isFinite(createdAt.getTime()) || createdAt.toISOString() !== payload.createdAt) {
            throw new Error('Invalid cursor timestamp');
        }

        return { createdAt, id: payload.id };
    } catch {
        throw new ValidationError('Invalid report list cursor');
    }
}
