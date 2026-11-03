import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import { connectToDatabase } from './database';
import { errorHandler } from './middleware/error-hendler';
import offenseRoute from "./routes/offense.route";
import { HOST, PORT } from './config';

export async function bootstrap() {
    const app = new Koa();

    app.use(errorHandler);
    app.use(bodyParser());



    app.use(authRoute.routes());
    app.use(authRoute.allowedMethods());

    app.use(userRoute.routes());
    app.use(userRoute.allowedMethods());

    app.use(offenseRoute.routes());
    app.use(offenseRoute.allowedMethods());

    await connectToDatabase();

    app.listen(PORT, HOST, () => console.log('Server listening on ' + HOST + ':' + PORT));
}

bootstrap();
