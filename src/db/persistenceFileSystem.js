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
      logger("error", error);
    }
  };

  insertMessage = async (newMessage) => {
    try {
      const mensajes = JSON.parse(await fs.promises.readFile('mensajes.txt'))
      newMessage.id = mensajes.length + 1;
      mensajes.push(newMessage);
      await fs.promises.writeFile('mensajes.txt', JSON.stringify(mensajes))
      return newMessage;
    } catch (error) {
      logger("error", error);
    }
  };

  /* PRODUCTS FUNCTIONS */

  findProducts = async () => {
    return this.productos;
  };

  findProduct = async (id) => {
    const product = this.productos.find((producto) => producto.id == id);
    return product;
  };

  putProduct = async (updateProduct, id) => {
    const product = this.productos.find((producto) => producto.id == id);
    if (!product) return product;
    product.title = updateProduct.title;
    product.price = updateProduct.price;
    product.thumbnail = updateProduct.thumbnail;
    return product;
  };

  removeProduct = async (id) => {
    const product = this.productos.find((producto) => producto.id == id);
    if (!product) return product;
    const newProductsArray = this.productos.filter(
      (producto) => producto.id != id
    );
    this.productos = newProductsArray;
    return product;
  };

  insertProduct = async (newProduct) => {
    newProduct.id = this.productos.length + 1;
    this.productos.push(newProduct);
    return newProduct;
  };
}
