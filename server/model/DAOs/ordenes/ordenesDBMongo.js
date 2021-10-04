

import mongodb from "mongodb";
import config from "../../../../config.js";
const { MongoClient, ObjectId } = mongodb;

class OrdenesDBMongoDAO {
  constructor(database, collection) {
    (async () => {
      console.log("Conectando a DB, coleccion Ordenes");

      const connection = await MongoClient.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = connection.db(database);
      this.ordenesCollection = db.collection(collection);
      /* ---------------------------------------------------------------- */
      console.log("Base de datos conectada, coleccion Ordenes");
    })();
  }

  getOrders = async (_id) => {
    try {
      if (_id) {
        const orden = await this.ordenesCollection.findOne({ _id: ObjectId(_id) });
        if (!orden) {
          return []
        }
        return [orden];
      } else {
        const ordenes = await this.ordenesCollection.find({}).toArray();
        return ordenes;
      }
    } catch (error) {
      console.log("getOrders error", error);
    }
  };

  postOrder = async (newOrder) => {
    try {
      const createOrder = await this.ordenesCollection.insertOne(newOrder)
      if (createOrder?.result?.ok == 1) {
        const data = await this.ordenesCollection.findOne({ email: newOrder.email, orderNumber: newOrder.orderNumber }, { productos: 1 });
        return data;
      } else {
        return null
      }
    } catch (error) {
      console.log("postOrder error", error);
      return null;
    }
  }

  putOrder = async (orderToUpdate) => {
    try {
      const updateOrder = await this.ordenesCollection.updateOne({ _id: ObjectId(orderToUpdate._id) },
      { $set: {
        status: orderToUpdate.status
      } })
      if (updateOrder?.result?.ok == 1) {
        const data = await this.ordenesCollection.findOne({ _id: ObjectId(orderToUpdate._id) });
        return data;
      } else {
        return null
      }
    } catch (error) {
      console.log("putOrder error", error);
      return null;
    }
  }

  deleteOrder = async (id) => {
    try {
      const orderToDelete = this.getOrders(id)
      await this.ordenesCollection.deleteOne({ _id: ObjectId(id) });
      return orderToDelete;
    } catch (error) {
      console.log("deleteOrder error", error);
      return null;
    }
  }



  deleteCarrito = async (id) => {
    try {
      let carritoEliminado = await this.getCarritos(id);
      await this.ordenesCollection.deleteOne({ _id: ObjectId(id) });
      return carritoEliminado;
    } catch (error) {
      console.log("eliminarProducto error", error);
      return carritoEliminado;
    }
  }
}

export default OrdenesDBMongoDAO;
