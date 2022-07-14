import { asValue, AwilixContainer } from 'awilix';
import { parseInt } from 'lodash';


type DatabaseConfig = {
    user?: string;
    password?: string;
    url?: string;
}

export type Configuration = {
    port: number;
    farmerMarketApi: string;
    appViteUrl: string;
    dataBase: DatabaseConfig;
}

export interface IConfigCradle {
    appConfig: Configuration
}

const registerConfiguration = (container: AwilixContainer<IConfigCradle>): void => {
    container.register({
        appConfig: asValue({
            port: parseInt(process.env.PORT!),
            farmerMarketApi: process.env.FARMER_MARKET_API!,
            appViteUrl: process.env.APP_VITE_URL!,
            dataBase: {
                user: process.env.MONGO_USERNAME,
                password: process.env.MONGO_PASSWORD,
                url: process.env.MONGO_URL,
            },
       }),
    });
}

export default registerConfiguration;