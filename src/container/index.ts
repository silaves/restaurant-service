import {IConfigCradle} from './config';
import {AwilixContainer, createContainer, InjectionMode} from 'awilix';
import registerConfiguration from "./config";
import registerApi, {IApiCradle} from "@app/container/api";
import registerStartUp, {IStartUpCradle} from "@app/container/startup";
import registerRoute, {IRouteCradle} from "@app/container/route";

interface IContainerCradle extends IConfigCradle, IApiCradle, IStartUpCradle, IRouteCradle {
}

const containerConfiguration = ():AwilixContainer<IContainerCradle> => {
    const container = createContainer<IContainerCradle>({
        injectionMode: InjectionMode.PROXY
    });

    registerConfiguration(container);
    registerApi(container);
    registerRoute(container);
    registerStartUp(container);

    return container;
}

export default containerConfiguration;