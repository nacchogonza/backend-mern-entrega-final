import ProductosDaoDB from "../DAO/ProductosDAODB.js";
import ProductoDTO from "../dto/ProductoDTO.js";
import ProductosDaoMem from "../DAO/ProductosDAOMem.js";
import ProductosDaoFS from "../DAO/ProductosDAOFS.js";

class ProductosApi {
  constructor(type) {
    switch (type) {
      case "Mongo":
        this.productosDao = new ProductosDaoDB();
        break;
      case "Mem":
        this.productosDao = new ProductosDaoMem();
        break;
      case "FS":
        this.productosDao = new ProductosDaoFS();
        break;
    }
    this.type = type;
  }

  async agregar(prodParaAgregar) {
    if (this.type == "Mongo") {
      const prodAgregado = await this.productosDao.add(prodParaAgregar);
      return prodAgregado;
    }
    if (this.type == "Mem" || this.type == "FS") {
      const productos = await this.productosDao.getAll();
      const productoDto = ProductoDTO.productoConInfo(
        prodParaAgregar,
        productos.length + 1
      );
      const prodAgregado = await this.productosDao.add(productoDto);
      return prodAgregado;
    }
  }

  async buscar(id) {
    let productos;
    if (id) {
      productos = await this.productosDao.getById(id);
    } else {
      productos = await this.productosDao.getAll();
    }
    return productos;
  }

  async borrar(id) {
    if (id) {
      return await this.productosDao.deleteById(id);
    } else {
      await this.productosDao.deleteAll();
    }
  }

  async reemplazar(id, prodParaReemplazar) {
    const prodReemplazado = await this.productosDao.updateById(
      id,
      prodParaReemplazar
    );
    return prodReemplazado;
  }

  exit() {
    this.productosDao.exit();
  }
}

export default ProductosApi;
