import {Router} from 'express';
import {PurchasesController} from '@app/api'
import {ValidationId} from '@app/middleware/ValidationId'
import {Schemas, ValidationSchema} from '@app/middleware/ValidationSchema'

type PurchasesRouterParams = {
  PurchasesController: PurchasesController,
}

export const PurchasesRoute = ({PurchasesController}: PurchasesRouterParams): Router => {
  const router = Router();
  router.post('/product/:id', ValidationId, ValidationSchema(Schemas.purchase.purchase), PurchasesController.purchase);
  router.post('/farmers-market/product/:id', ValidationId, PurchasesController.purchaseFromMarket);
  return router;
}
