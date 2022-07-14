import {Router} from 'express';
import {RecipeController} from '@app/api'
import {ValidationId} from '@app/middleware/ValidationId'
import {Schemas, ValidationSchema} from '@app/middleware/ValidationSchema'

type RecipeRouterParams = {
    RecipeController: RecipeController,
}

export const RecipeRoute = ({RecipeController}: RecipeRouterParams): Router => {
    const router = Router();
    router.get('/', RecipeController.retrieveAll);
    router.get('/product-filter/', RecipeController.retrieveAllFilter);
    router.get('/:id', ValidationId, RecipeController.retrieve);
    router.post('/create', ValidationSchema(Schemas.recipe.create), RecipeController.create);
    router.patch('/update/:id', ValidationId, ValidationSchema(Schemas.recipe.update), RecipeController.update);
    return router;
}
