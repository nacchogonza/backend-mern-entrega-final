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
  { idAttribute: "_id" }
);

// now, we have all code implementation from BaseRepository
export class MessagesRepositoryMongo extends BaseRepository {

    // here, we can create all especific stuffs of Spartan Repository
    async getAllMessages() {
        const itemsFound = await this._collection.find({})
        const dataJson = JSON.parse(JSON.stringify(itemsFound));
        /* normalizador */
        const normalizedData = normalize(dataJson, [messages]);

        return normalizedData;
    }

    /* insertMessage(newMessage: Message): Promise<Message> {
        return this._collection.insert(newMessage);
    } */
}