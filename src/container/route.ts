import {Router} from "express";
import {asFunction, AwilixContainer} from "awilix";
import {
    OrderRoute, ProductRoute, PurchasesRoute, RecipeRoute,
} from '@app/route'

export interface IRouteCradle {
    PurchasesRoute: Router,
    OrderRoute: Router,
    ProductRoute: Router,
    RecipeRoute: Router,
}

const registerRoute = (container: AwilixContainer<IRouteCradle>): void => {
    container.register({
        PurchasesRoute: asFunction(PurchasesRoute).singleton(),
        OrderRoute: asFunction(OrderRoute).singleton(),
        ProductRoute: asFunction(ProductRoute).singleton(),
        RecipeRoute: asFunction(RecipeRoute).singleton(),
    });
}

export default registerRoute;