import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import authRoute from './routes/auth.route';
import { connectToDatabase } from './database';
import { errorHandler } from './middleware/error-hendler';
import offenseRoute from "./routes/offense.route";

export async function bootstrap() {
    const app = new Koa();

    app.use(errorHandler);
    app.use(bodyParser());



    app.use(authRoute.routes());
    app.use(authRoute.allowedMethods());

    app.use(offenseRoute.routes());
    app.use(offenseRoute.allowedMethods());

    await connectToDatabase();

    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`));
}

bootstrap();
