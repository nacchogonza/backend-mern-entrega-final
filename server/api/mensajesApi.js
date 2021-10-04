
import MensajesDBMongoDAO from "../model/DAOs/mensajes/mensajesDBMongo.js";
import Mensajes from "../model/models/mensajes.js";


class ApiMensajes {
  constructor() {
    this.mensajesDao = new MensajesDBMongoDAO("ecommerce2", "mensajes");
  }

  async getMessages(id) {
    return await this.mensajesDao.getMessages(id);
  }

  async getUserMessages(useremail) {
    return await this.mensajesDao.getUserMessages(useremail);
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
