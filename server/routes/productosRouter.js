import express from 'express';
const router = express.Router();

import ProductosController from '../controller/productosController.js'

class RouterProductos {
  constructor() {
    this.productosController = new ProductosController(); // inicializar el controller
  }

  start() {
    router.get('/', this.productosController.getProducts)
    router.get('/:id?', this.productosController.getProducts)
    router.get('/categoria/:categoria', this.productosController.getProductsByCategory)
    router.post('/', this.productosController.insertProduct)
    router.put('/:id', this.productosController.updateProduct)
    router.delete('/:id', this.productosController.removeProduct)
    
    return router
  }
}

export default RouterProductos;