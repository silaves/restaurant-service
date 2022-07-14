import {Router} from 'express';
import {ProductController} from '@app/api'
import {Schemas, ValidationSchema} from '@app/middleware/ValidationSchema'
import {ValidationId} from '@app/middleware/ValidationId'

type ProductRouterParams = {
    ProductController: ProductController,
}

export const ProductRoute = ({ProductController}: ProductRouterParams): Router => {
    const router = Router();
    router.get('/', ProductController.retrieveAll);
    router.get('/with-stock', ProductController.retrieveAllWithStock);
    router.get('/:id', ValidationId, ProductController.retrieve);
    router.post('/create', ValidationSchema(Schemas.product.create), ProductController.create);
    router.patch('/update/:id', ValidationId, ValidationSchema(Schemas.product.update), ProductController.update);
    return router;
}
