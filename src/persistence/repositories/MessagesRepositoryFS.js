import fs from 'fs'
import { BaseRepository } from "./base/BaseRepository.js";
import normalizr from "normalizr";
import { logger } from "../../controller/logger.js";
const normalize = normalizr.normalize;
const { schema } = normalizr;

const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "email" });

const messages = new schema.Entity(
  "messages",
  {
    author: schemaAuthor,
  },
  { idAttribute: "id" }
);

export class MessagesRepositoryFS extends BaseRepository {
    constructor() {
      (async () => {
        super('mensajes.txt')
        try {
          await fs.promises.readFile("mensajes.txt");
        } catch (error) {
          await fs.promises.writeFile("mensajes.txt", JSON.stringify([]));
        }
      })();
    }
    async getAllMessages() {
      try {
        const mensajes = await fs.promises.readFile(this._collection);
        const dataJson =  JSON.parse(mensajes);
        /* normalizador */
        const normalizedData = normalize(dataJson, [messages]);
        return normalizedData
      } catch (error) {
        logger.log("error", error);
      }
    }

    async insertMessage(newMessage) {
        const data = {
          author: {
            email: newMessage.email,
            nombre: newMessage.nombre,
            apellido: newMessage.apellido,
            edad: newMessage.edad,
            alias: newMessage.alias,
            avatar: newMessage.avatar,
          },
          text: newMessage.text,
          date: newMessage.date,
        };

        try {
          const mensajes = JSON.parse(await fs.promises.readFile(this._collection));
          data.id = mensajes.length + 1;
          mensajes.push(data);
          await fs.promises.writeFile("mensajes.txt", JSON.stringify(mensajes));
          return data;
        } catch (error) {
          logger.log("error", error);
        }
    }
}