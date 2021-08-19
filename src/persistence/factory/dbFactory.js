import { Singleton } from '../Singleton.js';

class FactoryPersistence {
  static set(opcion) {
    console.log(`*** PERSISTENCIA SELECCIONADA: [${opcion}] ***`)
    switch (opcion) {
      case 'Mongo': {return new Singleton('Mongo')};
      case 'Mem': return new Singleton('Mem');
      case 'FS': return new Singleton('FS');
    }
  }
}

const opcion = process.argv[2] || "Mongo";
export default FactoryPersistence.set(opcion);