import express from 'express';
import CarritosController from '../controller/carritosController.js';
const router = express.Router();

import UsuariosController from '../controller/usuariosController.js';
import { verifyJWT } from '../utils/functions.js';

class RouterCarritos {
  constructor() {
    this.carritosController = new CarritosController(); // inicializar el controller
  }

  start() {
    router.get('/', this.carritosController.getCarts)
    router.get('/:email', this.carritosController.getCartByUser)
    router.post('/', this.carritosController.insertProductCart)
    router.delete('/', this.carritosController.deleteProductCart)
    router.delete('/:id', this.carritosController.deleteCart)
    
    return router
  }
}

export default RouterCarritos;
