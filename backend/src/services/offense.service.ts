import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { OffenseRepository } from '../repositories/offense.repository';
import { OffenseDocument } from '../models/offense.schema';
import { CreateOffenseDto, UpdateOffenseDto, OffenseResponseDto, PublicOffenseResponseDto } from '../dtos/offense.dto';
import { NotFoundError } from '../errors/app-err';
import { decodePublicOffenseCursor, encodePublicOffenseCursor } from '../utils/offense-pagination';

/**
 * OffenseService
 *
 * Сервіс для роботи з правопорушеннями:
 * - створення запису
 * - отримання списків (мої / всі)
 * - оновлення запису (лише власник)
 * - видалення запису (лише власник)
 */
@injectable()
export class OffenseService {
    constructor(@inject(TYPES.OffenseRepository) private repo: OffenseRepository) {}

    /**
     * Створення правопорушення для конкретного користувача
     * @param userId - ідентифікатор користувача
     * @param dto - дані для створення
     */
    async create(userId: string, dto: CreateOffenseDto) {
        const doc = await this.repo.create({
            user: userId as any,
            description: dto.description,
            category: dto.category,
            photoUrl: dto.photoUrl,
            photoId: dto.photoId,
            latitude: dto.latitude,
            longitude: dto.longitude,
            createdAt: new Date(dto.createdAt),
        } as any);

        return toDto(doc);
    }

    /**
     * Отримати всі правопорушення конкретного користувача
     */
    async listMine(userId: string) {
        const rows = await this.repo.findAllByUser(userId);
        return rows.map(toDto);
    }

    /**
     * Отримати всі правопорушення в системі
     */
    async listAll(options: { limit: number; cursor?: string }) {
        const cursor = options.cursor ? decodePublicOffenseCursor(options.cursor) : undefined;
        const rows = await this.repo.findAll(options.limit + 1, cursor);
        const hasMore = rows.length > options.limit;
        const page = rows.slice(0, options.limit);

        return {
            items: page.map(toPublicDto),
            nextCursor: hasMore && page.length
                ? encodePublicOffenseCursor(page[page.length - 1].createdAt, page[page.length - 1]._id.toHexString())
                : null,
        };
    }

    /**
     * Оновлення правопорушення (може зробити лише власник)
     * @throws NotFoundError якщо запис не існує або користувач не є власником
     */
    async update(userId: string, id: string, patch: UpdateOffenseDto) {
        const allowedPatch: Partial<OffenseDocument> = {};
        if (patch.description !== undefined) allowedPatch.description = patch.description;
        if (patch.category !== undefined) allowedPatch.category = patch.category;
        if (patch.photoUrl !== undefined) allowedPatch.photoUrl = patch.photoUrl;
        if (patch.photoId !== undefined) allowedPatch.photoId = patch.photoId;
        if (patch.latitude !== undefined) allowedPatch.latitude = patch.latitude;
        if (patch.longitude !== undefined) allowedPatch.longitude = patch.longitude;

        const updated = await this.repo.updateByIdForUser(id, userId, allowedPatch);
        if (!updated) throw new NotFoundError('Offense not found');
        return toDto(updated);
    }

    /**
     * Видалення правопорушення (може зробити лише власник)
     * @throws NotFoundError якщо запис не існує або користувач не є власником
     */
    async remove(userId: string, id: string) {
        const found = await this.repo.findById(id);
        if (!found) throw new NotFoundError('Offense not found');
        if (found.user.toHexString() !== userId) throw new NotFoundError('Offense not found');

        await this.repo.deleteById(id);
    }
}

/**
 * Перетворює документ MongoDB в DTO для відповіді API
 */
function toPublicDto(m: OffenseDocument): PublicOffenseResponseDto {
    const coarse = (value?: number) => value == null ? undefined : Math.round(value * 1000) / 1000;
    return {
        id: m.id,
        description: m.description,
        category: m.category as any,
        latitude: coarse(m.latitude),
        longitude: coarse(m.longitude),
        createdAt: m.createdAt.toISOString(),
    };
}

function toDto(m: OffenseDocument): OffenseResponseDto {
    return {
        id: m.id,
        userId: m.user.toHexString(),
        description: m.description,
        category: m.category as any,
        photoUrl: m.photoUrl,
        photoId: m.photoId,
        latitude: m.latitude,
        longitude: m.longitude,
        createdAt: m.createdAt.toISOString(),
    };
}
