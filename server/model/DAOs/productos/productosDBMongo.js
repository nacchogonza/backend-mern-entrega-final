
import mongodb from "mongodb";
import config from "../../../../config.js";
const { MongoClient, ObjectId } = mongodb;

class ProductosDBMongoDAO {
  constructor(database, collection) {
    (async () => {
      console.log("Conectando a DB, coleccion Productos");

      const connection = await MongoClient.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = connection.db(database);
      this.productosCollection = db.collection(collection);
      /* ---------------------------------------------------------------- */
      console.log("Base de datos conectada, coleccion productos");
    })();
  }

  obtenerProductos = async (_id) => {
    try {
      if (_id) {
        const producto = await this.productosCollection.findOne({
          _id: ObjectId(_id),
        });
        return [producto];
      } else {
        const productos = await this.productosCollection.find({}).toArray();
        return productos;
      }
    } catch (error) {
      console.log("obtenerProductos error", error);
    }
  };

  obtenerProductosPorCategoria = async (categoria) => {
    try {
      const productos = await this.productosCollection
        .find({ categoria: categoria })
        .toArray();
      return productos;
    } catch (error) {
      console.log("obtenerProductos error", error);
    }
  };

  guardarProducto = async (producto) => {
    try {
      await this.productosCollection.insertOne(producto);
      return producto;
    } catch (error) {
      console.log("guardarProducto error", error);
      return producto;
    }
  };

  actualizarProducto = async (_id, producto) => {
    try {
      await this.productosCollection.updateOne(
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
    let productoEliminado = { _id };
    try {
      await this.productosCollection.deleteOne({ _id: ObjectId(_id) });
      return productoEliminado;
    } catch (error) {
      console.log("eliminarProducto error", error);
      return productoEliminado;
    }
  };
}

export default ProductosDBMongoDAO;
