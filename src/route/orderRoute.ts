import {Router} from 'express';
import {OrderController} from '@app/api'
import {ValidationId} from '@app/middleware/ValidationId'
import {Schemas, ValidationSchema} from '@app/middleware/ValidationSchema'

type OrderRouterParams = {
  OrderController: OrderController,
}

export const OrderRoute = ({OrderController}: OrderRouterParams): Router => {
  const router = Router();
  router.get('/', OrderController.retrieveAll);
  router.get('/:id', ValidationId, OrderController.retrieve);
  router.post('/create', ValidationSchema(Schemas.order.create), OrderController.create);
  router.post('/simple-create', ValidationSchema(Schemas.order.simpleCreate), OrderController.randomCreate);
  router.post('/bulk-create', ValidationSchema(Schemas.order.bulkCreate), OrderController.bulkCreate);
  router.patch('/update/:id', ValidationId, ValidationSchema(Schemas.order.update), OrderController.update);
  router.post('/cancel/:id', ValidationId, OrderController.cancel);
  router.post('/finalize/:id', ValidationId, OrderController.finalize);
  router.post('/received-detail/:id', ValidationId, OrderController.orderDetailReceived);
  return router;
}
