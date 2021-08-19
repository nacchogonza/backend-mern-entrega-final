import fs from "fs";
import ProductosDao from "./ProductosDAO.js";

class ProductosDaoFS extends ProductosDao {
  constructor() {
    (async () => {
      super();
      try {
        await fs.promises.readFile("productos.txt");
        await fs.promises.readFile("mensajes.txt");
      } catch (error) {
        await fs.promises.writeFile("productos.txt", JSON.stringify([]));
        await fs.promises.writeFile("mensajes.txt", JSON.stringify([]));
      }
    })();
  }

  async getAll() {
    try {
      return JSON.parse(await fs.promises.readFile("productos.txt"));
    } catch (err) {
      throw new Error(err);
    }
  }

  async getById(idBuscado) {
    let buscado;
    try {
      const productos = JSON.parse(await fs.promises.readFile("productos.txt"));
      buscado = productos.find((p) => p.id == idBuscado);
    } catch (err) {
      throw new Error(err);
    }

    if (!buscado) {
      throw new Error(err);
    }

    return buscado;
  }

  async add(prodNuevo) {
    try {
      const productos = JSON.parse(await fs.promises.readFile("productos.txt"));
      productos.push(prodNuevo);
      await fs.promises.writeFile("productos.txt", JSON.stringify(productos));
    } catch (error) {
      throw new Error(err);
    }
    return prodNuevo;
  }

  async deleteById(idParaBorrar) {
    let result;
    try {
      const productos = JSON.parse(await fs.promises.readFile("productos.txt"));
      result = productos.find((p) => p.id == idParaBorrar);
      if (!result) return null;

      const newProductsArray = productos.filter((p) => p.id != idParaBorrar);

      await fs.promises.writeFile(
        "productos.txt",
        JSON.stringify(newProductsArray)
      );
    } catch (error) {
      throw new Error(err);
    }

    if (!result) {
      throw new Error(err);
    }
  
    return result;
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(
        "productos.txt",
        JSON.stringify([])
      );
    } catch (error) {
      throw new Error(err);
    }
  }

  async updateById(idParaReemplazar, nuevoProd) {
    let producto;
    try {
      const productos = JSON.parse(await fs.promises.readFile("productos.txt"));
      producto = productos.find((p) => p.id == idParaReemplazar);
      if (!producto) return null;
      producto.title = nuevoProd.title;
      producto.price = nuevoProd.price;
      producto.thumbnail = nuevoProd.thumbnail;

      // producto mantiene la referencia y sirve para reemplazar la informacion en FS
      await fs.promises.writeFile("productos.txt", JSON.stringify(productos));

    } catch (error) {
      throw new Error(err);
    }

    if (!producto) {
      throw new Error(err);
    }

    return nuevoProd;
  }

  exit() {
    this.client.disconnect();
  }
}

export default ProductosDaoFS;
