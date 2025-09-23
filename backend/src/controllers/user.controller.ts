import {Context} from "koa";
import {plainToInstance} from "class-transformer";
import {RegisterDto, UpdateUserDto} from "../dtos/user.dto";
import {validate} from "class-validator";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserService} from "../services/user.service";
import {formatValidationErrors} from "../errors/format";
import {ValidationError} from "../errors/app-err";

@injectable()
export class UserController {

    constructor(
        @inject(TYPES.UserService) private userService: UserService
    ) {
    }

    async findAll(ctx: Context) {
        ctx.body = await this.userService.findAll();
    }

    async findOne(ctx: Context) {
        const id = ctx.params.id;
        ctx.body = await this.userService.findById(id);
    }

    async update(ctx: Context) {
        const id = ctx.params.id;
        const dto = plainToInstance(UpdateUserDto, ctx.request.body);
        const errors = await validate(dto, {skipMissingProperties: true});
        if (errors.length) {
            throw new ValidationError("Validation failed", formatValidationErrors(errors));
        }
        ctx.body = await this.userService.updateById(id, dto);
    }

    async delete(ctx: Context) {
        const id = ctx.params.id;
        await this.userService.deleteById(id);
        ctx.status = 204;
    }
}