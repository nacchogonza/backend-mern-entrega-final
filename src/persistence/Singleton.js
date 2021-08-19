let instance = null;
import ProductosApi from "./api/ProductosAPI.js";

class Singleton {
  constructor(type) {
    switch (type) {
      case "Mongo": {
        this.connection = new ProductosApi("Mongo");
        break
      }
      case "Mem":
        this.connection = new ProductosApi("Mem");
        break
      case "FS":
        this.connection = new ProductosApi("FS");
        break
    }

    this.value = Math.random(100);
  }

  printConnection() {
    console.log(this.value);
  }

  static getInstance() {
    if (!instance) {
      instance = new Singleton();
    }

    return instance;
  }
}

export { Singleton };
