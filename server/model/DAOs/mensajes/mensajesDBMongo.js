import mongodb from "mongodb";
import config from "../../../../config.js";
const { MongoClient, ObjectId } = mongodb;

class MensajesDBMongoDAO {
  constructor(database, collection) {
    (async () => {
      console.log("Conectando a DB, coleccion Mensajes");

      const connection = await MongoClient.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = connection.db(database);
      this.mensajesCollection = db.collection(collection);
      /* ---------------------------------------------------------------- */
      console.log("Base de datos conectada, coleccion Mensajes");
    })();
  }

  getMessages = async (_id) => {
    try {
      if (_id) {
        const mensaje = await this.mensajesCollection.findOne({
          _id: ObjectId(_id),
        });
        return [mensaje];
      } else {
        const mensajes = await this.mensajesCollection.find({}).toArray();
        return mensajes;
      }
    } catch (error) {
      console.log("getMessages error", error);
    }
  };

  getUserMessages = async (useremail) => {
    try {
      const mensajes = await this.mensajesCollection
        .find({ email: useremail })
        .toArray();
      return mensajes;
    } catch (error) {
      console.log("getMessages error", error);
    }
  };

  postMessage = async (message) => {
    try {
      await this.mensajesCollection.insertOne(message);
      return message;
    } catch (error) {
      console.log("postMessage error", error);
      return message;
    }
  };

  putMessage = async (_id, message) => {
    try {
      await this.mensajesCollection.updateOne(
        { _id: ObjectId(_id) },
        { $set: message }
      );
      return message;
    } catch (error) {
      console.log("putMessage error", error);
      return message;
    }
  };

  deleteMessage = async (_id) => {
    let deletedMessage = { _id };
    try {
      await this.mensajesCollection.deleteOne({ _id: ObjectId(_id) });
      return deletedMessage;
    } catch (error) {
      console.log("deleteMessage error", error);
      return deletedMessage;
    }
  };
}

export default MensajesDBMongoDAO;
