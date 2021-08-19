import normalizr from "normalizr";
const normalize = normalizr.normalize;
const { schema } = normalizr;
import { logger } from "./logger.js";
import FactoryPersistence from '../persistence/factory/dbFactory.js';

const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "email" });

const messages = new schema.Entity(
  "messages",
  {
    author: schemaAuthor,
  },
  { idAttribute: "id" }
);


const getMessagesController = async () => {
  try {
    const data = await FactoryPersistence.connection.buscar();
    const dataJson = JSON.parse(JSON.stringify(data));
    /* normalizador */
    const normalizedData = normalize(dataJson, [messages]);

    return normalizedData;
  } catch (error) {
    logger.log("error", `Error al obtener mensajes del controller: ${error}`);
  }
};

const instertMessageController = async (newMessage) => {
  try {
    const data = {
      author: {
        email: newMessage.email,
        nombre: newMessage.nombre,
        apellido: newMessage.apellido,
        edad: newMessage.edad,
        alias: newMessage.alias,
        avatar: newMessage.avatar,
      },
      text: newMessage.text,
      date: newMessage.date,
    };
    return await FactoryPersistence.connection.insertMessage(data);
  } catch (error) {
    logger.log("error", `Error al insertar mensaje en controller: ${error}`);
  }
};

const getProductsController = async () => {
  try {
    const products = await FactoryPersistence.connection.buscar();
    return products;
  } catch (error) {
    logger.log("error", `Error al obtener productos en controller: ${error}`);
  }
};

const getProductController = async (id) => {
  try {
    const product = await FactoryPersistence.connection.buscar(id);
    return product;
  } catch (error) {
    logger.log(
      "error",
      `Error al obtener producto ${id} en controller: ${error}`
    );
  }
};

const putProductController = async (updateProduct, id) => {
  try {
    const updateStatus = await FactoryPersistence.connection.reemplazar(updateProduct, id);

    if (updateStatus?.ok === 1) {
      const product = await getProductController(id);
      return product;
    }

    return null;
  } catch (error) {
    logger.log(
      "error",
      `Error al actualizando el producto ${id} en controller: ${error}`
    );
  }
};

const removeProductController = async (id) => {
  try {
    return FactoryPersistence.connection.borrar(id);
  } catch (error) {
    logger.log(
      "error",
      `Error al eliminando el producto ${id} en controller: ${error}`
    );
  }
};

const insertProductController = async (newProduct) => {
  try {
    return await FactoryPersistence.connection.agregar({
      title: newProduct.title,
      price: newProduct.price,
      thumbnail: newProduct.thumbnail,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error al agregando nuevo producto en controller: ${error}`
    );
  }
};

export {
  getMessagesController,
  instertMessageController,
  getProductsController,
  getProductController,
  putProductController,
  removeProductController,
  insertProductController,
};
