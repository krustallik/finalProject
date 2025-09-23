import Router from 'koa-router';
import { container } from '../inversify.config';
import { TYPES } from '../types';
import { OffenseController } from '../controllers/offense.controller';
import { authGuard } from '../middleware/auth';

const router = new Router({ prefix: '/offenses' });
const ctrl = container.get<OffenseController>(TYPES.OffenseController);

// тільки для авторизованих
router.use(authGuard);

router.get('/mine', (ctx) => ctrl.mine(ctx));
router.get('/all', (ctx) => ctrl.all(ctx)); // за бажанням залиш або прибери
router.post('/', (ctx) => ctrl.create(ctx));
router.patch('/:id', (ctx) => ctrl.update(ctx));
router.delete('/:id', (ctx) => ctrl.delete(ctx));

export default router;