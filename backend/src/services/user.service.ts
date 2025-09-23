import {RegisterDto, UpdateUserDto, UserResponseDto} from "../dtos/user.dto";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserRepository} from "../repositories/user.repository";
import {UserDocument} from "../models/user.schema";
import {ConflictError, NotFoundError} from "../errors/app-err";

@injectable()
export class UserService {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository
    ) {
    }

    async findAll() {
        const users = await this.userRepository.findAll();
        return users.map(user => toUserResponseDto(user));
    }

    async findById(id: string) {
        const user = await this.userRepository.findById(id)
        if (!user) throw new NotFoundError(`User with id "${id}" not found`);
        return toUserResponseDto(user, true);
    }

    async create(dto: RegisterDto) {
        try {
            const user = await this.userRepository.create(dto);
            return toUserResponseDto(user, true);
        } catch (err: any) {
            if (err.code === 11000 && err.keyPattern?.email) {
                throw new ConflictError(`Email "${dto.email}" already exists`)
            }
            throw err;
        }
    }

    async updateById(id: string, dto: UpdateUserDto) {
        try {
            const user =  await this.userRepository.update(id, dto);
            if (!user) throw new NotFoundError(`User with id "${id}" not found`);
            return user;
        } catch (err: any) {
            if (err.code === 11000 && err.keyPattern?.email) {
                throw new ConflictError(`Email "${dto.email}" already exists`)
            }
            throw err;
        }
    }

    async deleteById(id: string) {
        const user = await this.userRepository.delete(id);
        if (!user) throw new NotFoundError(`User with id "${id}" not found`);
    }

}

function toUserResponseDto(user: UserDocument, includeEmail = false): UserResponseDto {
    const dto = {
        //id: user._id.toHexString(),//замість UserSchema.virtual('id').get
        id: user.id,
        name: user.name,
    } as UserResponseDto;

    if (includeEmail) {
        dto.email = user.email;
    }
    return dto;
}
