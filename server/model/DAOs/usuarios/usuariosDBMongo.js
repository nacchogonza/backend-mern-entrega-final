import mongodb from "mongodb";
import config from "../../../../config.js";

const { MongoClient } = mongodb;

class UsuariosDBMongoDAO {
  constructor(database, collection) {
    (async () => {
      console.log("Conectando a DB, coleccion Usuarios");

      const connection = await MongoClient.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const db = connection.db(database);
      this.usuariosCollection = db.collection(collection);
      /* ---------------------------------------------------------------- */
      console.log("Base de datos conectada, coleccion Usuarios");
    })();
  }

  getUsers = async () => {
    try {
      const users = await this.usuariosCollection.find({}).toArray();
      return users;
    } catch (error) {
      console.log("getUsers error", error);
    }
  };

  postUser = async (user) => {
    try {
      const createUser = await this.usuariosCollection.insertOne(user);
      if (createUser?.result?.ok == 1) {
        const data = await this.usuariosCollection.findOne({
          useremail: user.useremail,
        });
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("postUser error", error);
      return null;
    }
  };
}

export default UsuariosDBMongoDAO;
