import { SingletonFileSystem } from '../db/SingletonFileSystem.js';
import { SingletonMemory } from '../db/SingletonMemory.js';
import { SingletonMongo } from '../db/SingletonMongo.js';

class FactoryPersistence {
  static set(opcion) {
    console.log(`*** PERSISTENCIA SELECCIONADA: [${opcion}] ***`)
    switch (opcion) {
      case 'Mongo': return new SingletonMongo();
      case 'Mem': return new SingletonMemory();
      case 'FS': return new SingletonFileSystem();
    }
  }
}

const opcion = process.argv[2] || "Mongo";
export default FactoryPersistence.set(opcion);