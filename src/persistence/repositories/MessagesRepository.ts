import { BaseRepository } from "./base/BaseRepository";
import { Message } from "./entities/Message"

// now, we have all code implementation from BaseRepository
export class MessagesRepository extends BaseRepository<Message>{

    // here, we can create all especific stuffs of Spartan Repository
    getAllMessages(): Promise<Message[]> {
        return this._collection.find({})
    }

    insertMessage(newMessage: Message): Promise<Message> {
        return this._collection.insert(newMessage);
    }
}