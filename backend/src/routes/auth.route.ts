import Router from 'koa-router';
import { container } from '../inversify.config';
import { TYPES } from '../types';
import { AuthController } from '../controllers/auth.controller';
import { authRateLimit } from '../middleware/auth-rate-limit';

const router = new Router({ prefix: '/auth' });
const ctrl = container.get<AuthController>(TYPES.AuthController);
router.use(authRateLimit);

router.post('/register', ctx => ctrl.register(ctx));
router.post('/login', ctx => ctrl.login(ctx));

export default router;