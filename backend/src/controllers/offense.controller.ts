import { Context } from 'koa';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { OffenseService } from '../services/offense.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOffenseDto, UpdateOffenseDto } from '../dtos/offense.dto';
import { ValidationError } from '../errors/app-err';
import { formatValidationErrors } from '../errors/format';

@injectable()
export class OffenseController {
    constructor(@inject(TYPES.OffenseService) private service: OffenseService) {}

    async create(ctx: Context) {
        const dto = plainToInstance(CreateOffenseDto, ctx.request.body);
        const errors = await validate(dto);
        if (errors.length) throw new ValidationError('Validation failed', formatValidationErrors(errors));
        const userId = ctx.state.userId as string;
        ctx.body = await this.service.create(userId, dto);
        ctx.status = 201;
    }

    async mine(ctx: Context) {
        const userId = ctx.state.userId as string;
        ctx.body = await this.service.listMine(userId);
    }

    async all(ctx: Context) {
        ctx.body = await this.service.listAll();
    }

    async update(ctx: Context) {
        const dto = plainToInstance(UpdateOffenseDto, ctx.request.body);
        const errors = await validate(dto, { skipMissingProperties: true });
        if (errors.length) throw new ValidationError('Validation failed', formatValidationErrors(errors));
        const userId = ctx.state.userId as string;
        ctx.body = await this.service.update(userId, ctx.params.id, dto);
    }

    async delete(ctx: Context) {
        const userId = ctx.state.userId as string;
        await this.service.remove(userId, ctx.params.id);
        ctx.status = 204;
    }
}