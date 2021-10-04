/* traer valores de db del archivo de config */
import config from "../../config.js";
import MensajesDBMongoDAO from "../model/DAOs/mensajes/mensajesDBMongo.js";
import Mensajes from "../model/models/mensajes.js";

/* implementar modelo de mensajes */
import Productos from "../model/models/productos.js";

class ApiMensajes {
  constructor() {
    this.mensajesDao = new MensajesDBMongoDAO("ecommerce2", "mensajes");
  }

  async getMessages(id) {
    return await this.mensajesDao.getMessages(id);
  }

  async postMessage(message) {
    const validateResult = ApiMensajes.asegurarMensajeValido(message, true);
    if (!validateResult) {
      return validateResult
    }
    return await this.mensajesDao.postMessage(message);
  }

  async putMessage(id, message) {
    const validateResult = ApiMensajes.asegurarMensajeValido(message, false);
    if (!validateResult) {
      return validateResult
    }
    return await this.mensajesDao.putMessage(id, message);
  }

  async deleteMessage(id) {
    return await this.mensajesDao.deleteMessage(id);
  }

  static asegurarMensajeValido(message, requerido) {
    try {
      Mensajes.validar(message, requerido);
      return true;
    } catch (error) {
      console.log(
        "el mensaje no posee un formato json invalido o faltan datos: " +
          error.details[0].message
      );
      return null
    }
  }
}

export default ApiMensajes;
