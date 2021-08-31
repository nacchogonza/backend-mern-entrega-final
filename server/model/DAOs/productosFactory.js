import ProductosDBMongoDAO from "./productosDBMongo.js";
import ProductosMemDAO from "./productosMem.js";
import ProductosFileDAO from "./productosFile.js";

class ProductosFactoryDAO {
  static get(tipo) {
    switch (tipo) {
      case "MEM":
        return new ProductosMemDAO();
      case "FILE":
        return new ProductosFileDAO(process.cwd() + "/productos.json");
      case "MONGO":
        return new ProductosDBMongoDAO("ecommerce2", "productos");
      default:
        return new ProductosMemDAO();
    }
  }
}

export default ProductosFactoryDAO;
