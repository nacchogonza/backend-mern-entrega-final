import productoDTO from "../DTOs/productos.js";
import ProductosBaseDAO from "./ProductosBaseDAO.js";

class ProductosMemDAO extends ProductosBaseDAO {
  constructor() {
    super();
    this.productos = [];
  }

  obtenerProductos = async (_id) => {
    try {
      if (_id) {
        let index = this.productos.findIndex((producto) => producto._id == _id);
        return index >= 0 ? [this.productos[index]] : [];
      } else {
        return this.productos;
      }
    } catch (error) {
      console.log("error en obtenerProductos", error);
      return [];
    }
  };

  guardarProducto = async (producto) => {
    try {
      let _id = this.getNext_Id(this.productos);
      let fyh = new Date().toLocaleString();
      let productoGuardado = productoDTO(producto, _id, fyh);
      this.productos.push(productoGuardado);

      return productoGuardado;
    } catch (error) {
      console.log("error en guardarProducto:", error);
      let producto = {};

      return producto;
    }
  };

  actualizarProducto = async (_id, producto) => {
    try {
      let fyh = new Date().toLocaleString();
      let productoNew = productoDTO(producto, _id, fyh);

      let indice = this.getIndex(_id, this.productos);
      let productoActual = this.productos[indice] || {};

      let productoActualizado = { ...productoActual, ...productoNew };

      indice >= 0
        ? this.productos.splice(indice, 1, productoActualizado)
        : this.productos.push(productoActualizado);

      return productoActualizado;
    } catch (error) {
      console.log("error en actualizarProducto:", error);
      let producto = {};

      return producto;
    }
  };

  eliminarProducto = async (_id) => {
    try {
      let indice = this.getIndex(_id, this.productos);
      if (indice == -1) {
        console.log("error en eliminarProducto: el id ingresado no existe");
        return {};
      }
      let productoBorrado = this.productos.splice(indice, 1);

      return productoBorrado;
    } catch (error) {
      console.log("error en eliminarProducto:", error);
      let producto = {};

      return producto;
    }
  };
}

export default ProductosMemDAO;
