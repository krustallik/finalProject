import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { UserRepository } from '../repositories/user.repository';
import { ConflictError, NotFoundError, AppError } from '../errors/app-err';
import { RegisterDto, LoginDto } from '../dtos/user.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

@injectable()
export class AuthService {
    constructor(@inject(TYPES.UserRepository) private repo: UserRepository) {}

    async register(dto: RegisterDto) {
        const exists = await this.repo.findByEmail(dto.email);
        if (exists) throw new ConflictError(`Email "${dto.email}" already exists`);
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.repo.createWithHash({ name: dto.name, email: dto.email, passwordHash });
        const token = this.issueJwt(user.id);
        return { user: { id: user.id, name: user.name, email: user.email }, token };
    }

    async login(dto: LoginDto) {
        const user = await this.repo.findByEmail(dto.email);
        if (!user) throw new NotFoundError(`User with email "${dto.email}" not found`);
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) throw new AppError('Invalid credentials', 401);
        const token = this.issueJwt(user.id);
        return { user: { id: user.id, name: user.name, email: user.email }, token };
    }

    private issueJwt(userId: string) {
        return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
    }
}
