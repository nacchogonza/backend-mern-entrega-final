import { MensajeModel } from '../../model/MensajesSchema.js';
import { MessagesRepositoryFS } from '../repositories/MessagesRepositoryFS.js';
import { MessagesRepositoryMem } from '../repositories/MessagesRepositoryMem.js';
import { MessagesRepositoryMongo } from '../repositories/MessagesRepositoryMongo.js';


class FactoryRepository {
  static set(opcion) {
    console.log(`*** PERSISTENCIA SELECCIONADA: [${opcion}] ***`)
    switch (opcion) {
      case 'Mongo': return new MessagesRepositoryMongo(MensajeModel);
      case 'Mem': return new MessagesRepositoryMem([]);
      case 'FS': return new MessagesRepositoryFS('mensajes.txt');
    }
  }
}

const opcion = process.argv[2] || "Mongo";
export default FactoryRepository.set(opcion);