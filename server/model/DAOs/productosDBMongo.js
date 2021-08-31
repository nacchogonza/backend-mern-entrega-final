// import noticiaDTO from '../DTOs/noticias.js'
import ProductosBaseDAO from "./ProductosBaseDAO.js";
import productoDTO from "../DTOs/productos.js";

import mongodb from "mongodb";
const { MongoClient, ObjectId } = mongodb;

const URL =
  "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce2?retryWrites=true&w=majority";

class ProductosDBMongoDAO extends ProductosBaseDAO {
  constructor(database, collection) {
    super();
    (async () => {
      console.log("Contectando a la Base de datos...");

      const connection = await MongoClient.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = connection.db(database);
      this._collection = db.collection(collection);
      /* ---------------------------------------------------------------- */
      console.log("Base de datos conectada!");
    })();
  }

  obtenerProductos = async (_id) => {
    try {
      if (_id) {
        const producto = await this._collection.findOne({ _id: ObjectId(_id) });
        return [producto];
      } else {
        const productos = await this._collection.find({}).toArray();
        return productos;
      }
    } catch (error) {
      console.log("obtenerProductos error", error);
    }
  };

  guardarProducto = async (producto) => {
    try {
      await this._collection.insertOne(producto);
      return producto;
    } catch (error) {
      console.log("guardarProducto error", error);
      return producto;
    }
  };

  actualizarProducto = async (_id, producto) => {
    try {
      await this._collection.updateOne(
        { _id: ObjectId(_id) },
        { $set: producto }
      );
      return producto;
    } catch (error) {
      console.log("actualizarNoticia error", error);
      return producto;
    }
  };

  eliminarProducto = async (_id) => {
    let productoEliminado = productoDTO({}, _id, null);
    try {
      await this._collection.deleteOne({ _id: ObjectId(_id) });
      return productoEliminado;
    } catch (error) {
      console.log("eliminarProducto error", error);
      return productoEliminado;
    }
  };
}

export default ProductosDBMongoDAO;
