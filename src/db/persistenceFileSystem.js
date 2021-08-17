import fs from "fs";
import { logger } from "../controller/logger.js";

export class persistenceFileSystem {
  constructor() {
    (async () => {
      try {
        await fs.promises.readFile("productos.txt");
        await fs.promises.readFile("mensajes.txt");
      } catch (error) {
        await fs.promises.writeFile("productos.txt", JSON.stringify([]));
        await fs.promises.writeFile("mensajes.txt", JSON.stringify([]));
      }
    })();
  }

  /* MESSAGES FUNCTIONS */

  findMessages = async () => {
    try {
      const mensajes = await fs.promises.readFile("mensajes.txt");
      return JSON.parse(mensajes);
    } catch (error) {
      logger.log("error", error);
    }
  };

  insertMessage = async (newMessage) => {
    try {
      const mensajes = JSON.parse(await fs.promises.readFile("mensajes.txt"));
      newMessage.id = mensajes.length + 1;
      mensajes.push(newMessage);
      await fs.promises.writeFile("mensajes.txt", JSON.stringify(mensajes));
      return newMessage;
    } catch (error) {
      logger.log("error", error);
    }
  };

  /* PRODUCTS FUNCTIONS */

  findProducts = async () => {
    try {
      return JSON.parse(await fs.promises.readFile("productos.txt"));
    } catch (error) {
      logger.log("error", error);
    }
  };

  findProduct = async (id) => {
    try {
      const productosData = await fs.promises.readFile("productos.txt");
      const productos = JSON.parse(productosData);
      const producto = productos.find((p) => p.id == id);
      return producto;
    } catch (error) {
      logger.log("error", error);
    }
  };

  putProduct = async (updateProduct, id) => {
    try {
      const productosData = await fs.promises.readFile("productos.txt");
      const productos = JSON.parse(productosData);
      const producto = productos.find((p) => p.id == id);
      if (!producto) return producto;
      producto.title = updateProduct.title;
      producto.price = updateProduct.price;
      producto.thumbnail = updateProduct.thumbnail;

      // producto mantiene la referencia y sirve para reemplazar la informacion en FS
      await fs.promises.writeFile("productos.txt", JSON.stringify(productos));
      return producto;
    } catch (error) {
      logger.log("error", error);
    }
  };

  removeProduct = async (id) => {
    try {
      const productosData = await fs.promises.readFile("productos.txt");
      const productos = JSON.parse(productosData);
      const producto = productos.find((p) => p.id == id);
      if (!producto) return producto;

      const newProductsArray = productos.find((p) => p.id != id);

      await fs.promises.writeFile(
        "productos.txt",
        JSON.stringify(newProductsArray)
      );
      return producto;
    } catch (error) {
      logger.log("error", error);
    }
  };

  insertProduct = async (newProduct) => {
    try {
      const productos = JSON.parse(await fs.promises.readFile("productos.txt"));
      newProduct.id = productos.length + 1;
      productos.push(newProduct);
      await fs.promises.writeFile("productos.txt", JSON.stringify(productos));
      return newProduct;
    } catch (error) {
      logger.log("error", error);
    }
  };
}
