import Router from "koa-router";
import {UserController} from "../controllers/user.controller";
import {TYPES} from "../types";
import {container} from '../inversify.config';
import {IdParamDto} from "../dtos/id-param.dto";
import {validateParams} from "../middleware/validate-params";
import {requireAuth} from "../middleware/require-auth";


const router = new Router({ prefix: '/users' });
const controller = container.get<UserController>(TYPES.UserController);
router.use(requireAuth); // запити нижче – лише з валідним JWT

router.get('/', ctx => controller.findAll(ctx));
router.get('/:id', validateParams(IdParamDto), ctx => controller.findOne(ctx));
router.patch('/:id', validateParams(IdParamDto), ctx => controller.update(ctx));
router.delete('/:id', validateParams(IdParamDto), ctx => controller.delete(ctx));

export default router;
