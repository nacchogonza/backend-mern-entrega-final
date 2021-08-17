let instance = null;
import { persistenceFileSystem } from "./persistenceFileSystem.js";

class SingletonFileSystem {
  constructor() {
    this.connection = new persistenceFileSystem();
    this.value = Math.random(100);
  }

  printConnection() {
    console.log(this.value);
  }

  static getInstance() {
    if (!instance) {
      instance = new SingletonFileSystem();
    }

    return instance;
  }
}

export { SingletonFileSystem };
