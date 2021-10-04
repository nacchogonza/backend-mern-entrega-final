/* traer datos del archivo de config */
import config from "../../config.js";
import CarritosDBMongoDAO from "../model/DAOs/carritos/carritosDBMongo.js";
import OrdenesDBMongoDAO from "../model/DAOs/ordenes/ordenesDBMongo.js";
import Productos from "../model/models/productos.js";

class ApiOrdenes {
  constructor() {
    this.ordenesDAO = new OrdenesDBMongoDAO("ecommerce2", "ordenes");
  }

  async getOrders(id) {
    return await this.ordenesDAO.getOrders(id);
  }

  async postOrder(newOrder) {
    return await this.ordenesDAO.postOrder(newOrder);
  }

  async putOrder(orderToUpdate) {
    return await this.ordenesDAO.putOrder(orderToUpdate);
  }

  async deleteOrder(id) {
    return await this.ordenesDAO.deleteOrder(id);
  }
}

export default ApiOrdenes;
