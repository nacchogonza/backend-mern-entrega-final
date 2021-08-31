import ApiProductos from "../api/productosApi.js";

class ProductosController {
  constructor() {
    this.apiProductos = new ApiProductos();
  }

  getProducts = async (req, res) => {
    try {
      const id = req.params.id;
      const productos = await this.apiProductos.getProductos(id);
      res.send(productos);
    } catch (error) {
      console.log("error getProducts controller: ", error);
    }
  };

  insertProduct = async (req, res) => {
    try {
      let producto = req.body;
      let productoGuardado = await this.apiProductos.postProducto(producto);
      res.json(productoGuardado);
    } catch (error) {
      console.log("error postProduct: ", error);
    }
  };

  updateProduct = async (req, res) => {
    try {
      let producto = req.body;
      let idProducto = req.params.id;
      let productoActualizado = await this.apiProductos.actualizarProducto(
        idProducto,
        producto
      );
      res.json(productoActualizado);
    } catch (error) {
      console.log("error updateProduct", error);
    }
  };

  removeProduct = async (req, res) => {
    try {
      let idProducto = req.params.id;
      let productoEliminado = await this.apiProductos.eliminarProducto(
        idProducto
      );
      res.json(productoEliminado);
    } catch (error) {
      console.log("error removeProduct", error);
    }
  };
}

export default ProductosController;
