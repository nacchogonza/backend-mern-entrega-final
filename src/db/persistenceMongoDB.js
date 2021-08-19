import mongoose from "mongoose";
import { mensajesSchema } from "../model/MensajesSchema.js";
import { ProductoModel, productosSchema } from "../model/ProductosSchema.js";
import { logger } from "../controller/logger.js";

const DaoMensajes = mongoose.model("mensajes", mensajesSchema);
const DaoProductos = mongoose.model("productos", productosSchema);

/* DB CONNECT */

const URL = "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce2?retryWrites=true&w=majority";

export class persistenceMongo {
  constructor() {
    try {
      mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.log("info", "Base de datos conectada!");
    } catch (error) {
      logger.log("error", `Error al conectar a la base de datos: ${error}`);
    }
  }

  /* MESSAGES FUNCTIONS */
  
  findMessages = async () => {
    try {
      const data = await DaoMensajes.find({});
      return data;
    } catch (error) {
      logger.log("error", `Error al obtener mensajes de la DB: ${error}`);
    }
  };
  
  insertMessage = async (newMessage) => {
    try {
      return await DaoMensajes.create(newMessage);
    } catch (error) {
      logger.log("error", `Error al insertar mensaje: ${error}`);
    }
  };
  
  /* PRODUCTS FUNCTIONS */
  
  findProducts = async () => {
    try {
      return await DaoProductos.find({});
    } catch (error) {
      logger.log("error", `Error al obtener productos de la DB: ${error}`);
    }
  };
  
  findProduct = async (id) => {
    try {
      return await DaoProductos.findOne({ _id: id });
    } catch (error) {
      logger.log("error", `Error al obtener producto en la DB: ${error}`);
    }
  };
  
  putProduct = async (updateProduct, id) => {
    try {
      return await DaoProductos.updateOne(
        { _id: id },
        {
          $set: {
            title: updateProduct.title,
            price: updateProduct.price,
            thumbnail: updateProduct.thumbnail,
          },
        }
      );
    } catch (error) {
      logger.log("error", `Error al modificar producto en DB: ${error}`);
    }
  };
  
  removeProduct = async (id) => {
    try {
      return await DaoProductos.findOneAndRemove({ _id: id });
    } catch (error) {
      logger.log("error", `Error al borrar producto de la DB: ${error}`);
    }
  };
  
  insertProduct = async (newProduct) => {
    try {
      return await DaoProductos.create(newProduct);
    } catch (error) {
      logger.log("error", `Error al insertar producto en DB: ${error}`);
    }
  };
}

