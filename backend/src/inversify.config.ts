import { Container } from 'inversify';
import { TYPES } from './types';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

import { OffenseService } from './services/offense.service';
import { OffenseController } from './controllers/offense.controller';
import { OffenseRepository } from './repositories/offense.repository';

const container = new Container();

container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

container.bind<OffenseController>(TYPES.OffenseController).to(OffenseController).inSingletonScope();
container.bind<OffenseService>(TYPES.OffenseService).to(OffenseService).inSingletonScope();
container.bind<OffenseRepository>(TYPES.OffenseRepository).to(OffenseRepository).inSingletonScope();

export { container };