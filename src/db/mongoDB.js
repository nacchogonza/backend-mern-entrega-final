import mongoose from "mongoose";
import { logger } from "../controller/logger.js";

/* SCHEMAS */

const mensajesSchema = new mongoose.Schema({
  author: {
    email: {
      type: String,
      require: true,
      max: 100,
    },
    nombre: {
      type: String,
      require: true,
      max: 100,
    },
    apellido: {
      type: String,
      require: true,
      max: 100,
    },
    edad: {
      type: String,
      require: true,
      max: 100,
    },
    alias: {
      type: String,
      require: true,
      max: 100,
    },
    avatar: {
      type: String,
      require: true,
      max: 100,
    },
  },
  text: {
    type: String,
    require: true,
    max: 255,
  },
  date: {
    type: String,
    require: true,
    max: 100,
  },
});

const productosSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    max: 100,
  },
  price: {
    type: Number,
    require: true,
  },
  thumbnail: {
    type: String,
    require: true,
    max: 255,
  },
});

/* MODELS */

const DaoMensajes = mongoose.model("mensajes", mensajesSchema);
const DaoProductos = mongoose.model("productos", productosSchema);

/* DB CONNECT */

const URL =
  "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce2?retryWrites=true&w=majority";

export const connectDB = () => {
  try {
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.log("info", "Base de datos conectada!");
  } catch (error) {
    logger.log("error", `Error al conectar a la base de datos: ${error}`);
  }
};

/* MESSAGES FUNCTIONS */

export const findMessages = async () => {
  try {
    const data = await DaoMensajes.find({});
    return data
  } catch (error) {
    logger.log("error", `Error al obtener mensajes de la DB: ${error}`);
  }
};

export const insertMessage = async (newMessage) => {
  try {
    return await DaoMensajes.create(newMessage);
  } catch (error) {
    logger.log("error", `Error al insertar mensaje: ${error}`);
  }
};

/* PRODUCTS FUNCTIONS */

export const findProducts = async () => {
  try {
    return await DaoProductos.find({});
  } catch (error) {
    logger.log("error", `Error al obtener productos de la DB: ${error}`);
  }
};

export const findProduct = async (id) => {
  try {
    return await DaoProductos.findOne({ _id: id });
  } catch (error) {
    logger.log("error", `Error al obtener producto en la DB: ${error}`);
  }
};

export const putProduct = async (updateProduct, id) => {
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

export const removeProduct = async (id) => {
  try {
    return await DaoProductos.findOneAndRemove({ _id: id });
  } catch (error) {
    logger.log("error", `Error al borrar producto de la DB: ${error}`);
  }
};

export const insertProduct = async (newProduct) => {
  try {
    return await DaoProductos.create(newProduct);
  } catch (error) {
    logger.log("error", `Error al insertar producto en DB: ${error}`);
  }
};
