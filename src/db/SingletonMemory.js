let instance = null;
import { persistenceMemory } from './persistenceMemory.js';

class SingletonMemory {
  constructor() {
    this.connection = new persistenceMemory()
    this.value = Math.random(100)
  }

  printConnection () {
    console.log(this.value);
  }

  static getInstance() {
    if (!instance) {
      instance = new SingletonMemory()
    }

    return instance;
  }
}

export { SingletonMemory }