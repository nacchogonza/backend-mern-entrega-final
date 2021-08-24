import { BaseRepository } from "./base/BaseRepository.js";
import normalizr from "normalizr";
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

export class MessagesRepositoryMem extends BaseRepository {

    async getAllMessages() {
      const dataJson = this._collection;
      const normalizedData = normalize(dataJson, [messages]);
      return normalizedData
    }

    insertMessage(newMessage) {
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

      const id = this._collection.length + 1;
      data.id = id;
      this._collection.push(data);
      return data;
    }
}