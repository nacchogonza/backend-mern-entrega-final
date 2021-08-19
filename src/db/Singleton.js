let instance = null;
import ProductosApi from "./api/ProductosAPI.js";

class Singleton {
  constructor(type) {
    switch (type) {
      case 'Mongo': this.connection = new ProductosApi("Mongo");
      case 'Mem': this.connection = new ProductosApi("Mem");
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
