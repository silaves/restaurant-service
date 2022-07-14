import {asClass, AwilixContainer} from "awilix";
import {
    OrderController,
    ProductController,
    PurchasesController, RecipeController,
} from '@app/api';
import {PurchaseService} from '@app/service/purchaseService'

export interface IApiCradle {
    purchaseService: PurchaseService,
    PurchasesController: PurchasesController,
    OrderController: OrderController,
    ProductController: ProductController,
    RecipeController: RecipeController,
}

const registerApi = (container: AwilixContainer<IApiCradle>): void => {
    container.register({
        purchaseService: asClass(PurchaseService).singleton(),
        PurchasesController: asClass(PurchasesController.bind(PurchasesController)).singleton(),
        OrderController: asClass(OrderController.bind(OrderController)).singleton(),
        ProductController: asClass(ProductController.bind(ProductController)).singleton(),
        RecipeController: asClass(RecipeController.bind(RecipeController)).singleton(),
    });
}

export default registerApi;