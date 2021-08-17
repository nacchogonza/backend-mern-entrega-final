let instance = null;
import { persistenceMongo } from './persistenceMongoDB.js';

class SingletonMongo {
  constructor() {
    this.connection = new persistenceMongo()
    this.value = Math.random(100)
  }

  printConnection () {
    console.log(this.value);
  }

  static getInstance() {
    if (!instance) {
      instance = new SingletonMongo()
    }

    return instance;
  }
}

export { SingletonMongo }