import config from "../../config.js";
import ProductosFactoryDAO from "../model/DAOs/productosFactory.js";
import Productos from "../model/models/productos.js";

class ApiProductos {
  constructor() {
    this.productosDAO = ProductosFactoryDAO.get(config.PERSISTENCE);
  }

  async getProductos(id) {
    return await this.productosDAO.obtenerProductos(id);
  }

  async postProducto(producto) {
    ApiProductos.asegurarProductoValido(producto, true);
    return await this.productosDAO.guardarProducto(producto);
  }

  async actualizarProducto(idProducto, producto) {
    ApiProductos.asegurarProductoValido(producto, false);
    return await this.productosDAO.actualizarProducto(idProducto, producto);
  }

  async eliminarProducto(idProducto) {
    return await this.productosDAO.eliminarProducto(idProducto);
  }

  static asegurarProductoValido(producto, requerido) {
    try {
      Productos.validar(producto, requerido);
      return;
    } catch (error) {
      throw new Error(
        "el producto no posee un formato json invalido o faltan datos: " +
          error.details[0].message
      );
    }
  }
}

export default ApiProductos;
