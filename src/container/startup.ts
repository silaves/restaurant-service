import express, { Router, Express } from "express";
import {asFunction, AwilixContainer} from "awilix";
import helmet from "helmet";
import cors from "cors";
import {requestLogger, errorLogger} from "@app/middleware/requestLogger";

export interface IStartUpCradle {
    router: Router;
    express: Express;
}

const registerStartUp = (container: AwilixContainer<IStartUpCradle>): void => {
    container.register({
        router: asFunction( ({
            PurchasesRoute,
            OrderRoute,
            ProductRoute,
            RecipeRoute,
        }) => {
            const router = Router();
            router.use(express.json());
            router.use('/purchase', PurchasesRoute as Router);
            router.use('/order', OrderRoute as Router);
            router.use('/product', ProductRoute as Router);
            router.use('/recipe', RecipeRoute as Router);
            return router;
        }),
        express: asFunction( ({ router, appConfig }) => {
            const app = express();
            app.use(helmet());
            app.use(cors({
                origin: appConfig.appViteUrl,
            }));
            app.use(requestLogger);
            app.use(errorLogger);
            app.use('/api', router as Router);
            return app;
        }),
    });
}

export default registerStartUp;
