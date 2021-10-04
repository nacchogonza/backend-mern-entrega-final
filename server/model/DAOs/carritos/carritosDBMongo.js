
import mongodb from "mongodb";
import config from "../../../../config.js";
const { MongoClient, ObjectId } = mongodb;

const URL = config.DB_URL;

class CarritosDBMongoDAO {
  constructor(database, collection) {
    (async () => {
      console.log("Conectando a DB, coleccion Carritos");

      const connection = await MongoClient.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = connection.db(database);
      this.carritosCollection = db.collection(collection);
      /* ---------------------------------------------------------------- */
      console.log("Base de datos conectada, coleccion Carritos");
    })();
  }

  getCarts = async (_id) => {
    try {
      if (_id) {
        const carrito = await this.carritosCollection.findOne({ _id: ObjectId(_id) });
        return [carrito];
      } else {
        const carritos = await this.carritosCollection.find({}).toArray();
        return carritos;
      }
    } catch (error) {
      console.log("getCarts error", error);
    }
  };

  postCart = async (newCart) => {
    try {
      const createCart = await this.carritosCollection.insertOne(newCart)
      if (createCart?.result?.ok == 1) {
        const data = await this.carritosCollection.findOne({ useremail: newCart.useremail });
        return data;
      } else {
        return null
      }
    } catch (error) {
      console.log("postCart error", error);
      return null;
    }
  }

  putCart = async (id, products) => {
    try {
      const updateCartStatus = await this.carritosCollection.updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            productos: products,
          },
        }
      );

      if (updateCartStatus?.result?.ok == 1) {
        const data = await this.carritosCollection.findOne({_id: ObjectId(id)});
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("putCart error", error);
      return null
    }
  }

  /* deleteProductCart = async (productToDelete, user) => {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.useremail === user.useremail)
    if (cart && cart.productos) {
      const auxProducts = cart.productos.filter(
        (product) => product.product._id !== productToDelete._id
      );
      const updateCartStatus = await this.carritosCollection.updateOne(
        { useremail: user.useremail },
        {
          $set: {
            productos: auxProducts,
          },
        }
      );
      if (updateCartStatus?.result?.ok === 1) {
        const data = await this.carritosCollection.findOne({ useremail: user.useremail }, { productos: 1 });
        if (!auxProducts.length) {
          await this.carritosCollection.deleteOne({ useremail: user.useremail });
          console.log('carrito eliminado por falta de productos')
        }
        return data;
      }
    } else {
      return null
    }
  }; */

  deleteCart = async (id) => {
    try {
      let carritoEliminado = await this.getCarts(id);
      await this.carritosCollection.deleteOne({ _id: ObjectId(id) });
      return carritoEliminado;
    } catch (error) {
      console.log("deleteCarrito error", error);
      return null;
    }
  }
}

export default CarritosDBMongoDAO;
