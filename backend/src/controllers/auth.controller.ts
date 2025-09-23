import { Context } from 'koa';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dtos/user.dto';
import { ValidationError } from '../errors/app-err';
import { formatValidationErrors } from '../errors/format';

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private auth: AuthService) {}

    async register(ctx: Context) {
        const dto = plainToInstance(RegisterDto, ctx.request.body);
        const errors = await validate(dto);
        if (errors.length) throw new ValidationError('Validation failed', formatValidationErrors(errors));
        ctx.body = await this.auth.register(dto);
        ctx.status = 201;
    }

    async login(ctx: Context) {
        const dto = plainToInstance(LoginDto, ctx.request.body);
        const errors = await validate(dto);
        if (errors.length) throw new ValidationError('Validation failed', formatValidationErrors(errors));
        ctx.body = await this.auth.login(dto);
    }
}
