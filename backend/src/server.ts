import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import userRoute from './routes/user.route';
import authRoute from './routes/auth.route';
import { connectToDatabase } from './database';
import { errorHandler } from './middleware/error-hendler';

export async function bootstrap() {
    const app = new Koa();

    app.use(errorHandler);
    app.use(bodyParser());

    app.use(authRoute.routes());
    app.use(authRoute.allowedMethods());
    app.use(userRoute.routes());
    app.use(userRoute.allowedMethods());

    await connectToDatabase();

    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`));
}

bootstrap();
