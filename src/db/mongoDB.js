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

const usuariosSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    max: 255,
  },
  password: {
    type: String,
    require: true,
    max: 255,
  },
  direccion: {
    type: String,
    require: true,
    max: 255,
  },
});

/* MODELS */

const DaoMensajes = mongoose.model("mensajes", mensajesSchema);
const DaoProductos = mongoose.model("productos", productosSchema);
const DaoUsuarios = mongoose.model("usuarios", usuariosSchema);

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
    const products = await DaoProductos.find({});
    return products;
  } catch (error) {
    logger.log("error", `Error al obtener productos: ${error}`);
  }
};
export const findProduct = async (id) => {
  try {
    const product = await DaoProductos.findOne({ _id: id });
    return product;
  } catch (error) {
    logger.log("error", `Error al obtener producto: ${error}`);
  }
};

export const putProduct = async (updateProduct, id) => {
  try {
    const updateStatus = await DaoProductos.updateOne(
      { _id: id },
      {
        $set: {
          title: updateProduct.title,
          price: updateProduct.price,
          thumbnail: updateProduct.thumbnail,
        },
      }
    );
    if (updateStatus?.ok === 1) {
      const product = await DaoProductos.findOne({ _id: id });
      return product;
    }
    return null;
  } catch (error) {
    logger.log("error", `Error al modificar producto: ${error}`);
  }
};

export const removeProduct = async (id) => {
  try {
    const removeStatus = await DaoProductos.findOneAndRemove({ _id: id });
    return removeStatus;
  } catch (error) {
    logger.log("error", `Error al borrar producto: ${error}`);
  }
};

export const insertProduct = async (newProduct) => {
  try {
    return await DaoProductos.create({
      title: newProduct.title,
      price: newProduct.price,
      thumbnail: newProduct.thumbnail,
    });
  } catch (error) {
    logger.log("error", `Error al insertar mensaje: ${error}`);
  }
};

/* USUARIOS */

export const findUsuarios = async () => {
  try {
    const users = await DaoUsuarios.find({});
    return users;
  } catch (error) {
    logger.log("error", `Error al obtener usuarios: ${error}`);
  }
};

export const insertUsuario = async (newUser) => {
  try {
    return await DaoUsuarios.create({
      username: newUser.username,
      password: newUser.password,
      direccion: newUser.direccion,
    });
  } catch (error) {
    logger.log("error", `Error al insertar usuario: ${error}`);
  }
};
