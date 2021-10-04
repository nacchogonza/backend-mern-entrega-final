/* traer datos del archivo de config */
import config from "../../config.js";
import ProductosDBMongoDAO from "../model/DAOs/productos/productosDBMongo.js";
import Productos from "../model/models/productos.js";

class ApiProductos {
  constructor() {
    this.productosDAO = new ProductosDBMongoDAO("ecommerce2", "productos");
  }

  async getProductos(id) {
    return await this.productosDAO.obtenerProductos(id);
  }

  async getProductosPorCategoria(categoria) {
    return await this.productosDAO.obtenerProductosPorCategoria(categoria);
  }

  async postProducto(producto) {
    const validateResult = ApiProductos.asegurarProductoValido(producto, true);
    if (!validateResult) {
      return validateResult
    }
    return await this.productosDAO.guardarProducto(producto);
  }

  async actualizarProducto(idProducto, producto) {
    const validateResult = ApiProductos.asegurarProductoValido(producto, false);
    if (!validateResult) {
      return validateResult
    }
    return await this.productosDAO.actualizarProducto(idProducto, producto);
  }

  async eliminarProducto(idProducto) {
    return await this.productosDAO.eliminarProducto(idProducto);
  }

  static asegurarProductoValido(producto, requerido) {
    try {
      Productos.validar(producto, requerido);
      return true;
    } catch (error) {
      console.log(
        "el producto no posee un formato json invalido o faltan datos: " +
          error.details[0].message
      );
      return null
    }
  }
}

export default ApiProductos;
