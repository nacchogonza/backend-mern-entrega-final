import express from 'express';
const router = express.Router();

import MensajesController from '../controller/mensajesController.js';

class RouterMensajes {
  constructor() {
    this.mensajesController = new MensajesController(); // inicializar el controller
  }

  start() {
    router.get('/', this.mensajesController.getMessagesController)
    router.get('/:id', this.mensajesController.getMessagesController)
    router.get('/usuario/:email', this.mensajesController.getMessagesByUserController)
    router.post('/', this.mensajesController.postMessageController)
    router.delete('/:id', this.mensajesController.deleteMessageController)
    
    return router
  }
}

export default RouterMensajes;