import express from 'express';
import OrdenesController from '../controller/ordenesController.js';
const router = express.Router();


class RouterOrdenes {
  constructor() {
    this.ordenesController = new OrdenesController(); // inicializar el controller
  }

  start() {
    router.get('/', this.ordenesController.getOrdersController)
    router.get('/:id?', this.ordenesController.getOrdersController)
    router.post('/', this.ordenesController.generateOrderController)
    router.put('/', this.ordenesController.putOrderController)
    router.delete('/:id', this.ordenesController.deleteOrderController)
    
    return router
  }
}

export default RouterOrdenes;
