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

  getProductsByCategory = async (req, res) => {
    try {
      const categoria = req.params.categoria;
      const productos = await this.apiProductos.getProductosPorCategoria(
        categoria
      );
      res.send(productos);
    } catch (error) {
      console.log("error getProducts controller: ", error);
    }
  };

  insertProduct = async (req, res) => {
    try {
      let producto = req.body;
      let productoGuardado = await this.apiProductos.postProducto({
        title: producto.title,
        price: Number(producto.price),
        description: producto.description,
        categoria: producto.categoria,
        thumbnail: producto.thumbnail
      });
      if (producto.isBrowser) {
        res.status(200).redirect('/productos')
        return;
      }
      if (!productoGuardado) {
        res.status(500).json({ error: "error al insertar producto" });
        return;
      }
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
