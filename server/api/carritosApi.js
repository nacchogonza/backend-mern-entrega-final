/* traer datos del archivo de config */
import config from "../../config.js";
import CarritosDBMongoDAO from "../model/DAOs/carritos/carritosDBMongo.js";
import Productos from "../model/models/productos.js";

class ApiCarritos {
  constructor() {
    this.carritosDAO = new CarritosDBMongoDAO("ecommerce2", "carritos");
  }

  async getCarts(id) {
    return await this.carritosDAO.getCarts(id);
  }

  async postProductCart(newCart) {
    return await this.carritosDAO.postCart(newCart);
  }

  async putCart(id, updatedProducts) {
    return await this.carritosDAO.putCart(id, updatedProducts);
  }

  async deleteCart(id) {
    return await this.carritosDAO.deleteCart(id);
  }
}

export default ApiCarritos;
