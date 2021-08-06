import normalizr from "normalizr";
const normalize = normalizr.normalize;
const { schema } = normalizr;
import util from "util";
import { logger } from "./logger.js";
import { findMessages, insertMessage } from "../db/mongoDB.js";

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true));
}

const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "email" });

const messages = new schema.Entity(
  "messages",
  {
    author: schemaAuthor,
  },
  { idAttribute: "_id" }
);

const getMessagesController = async () => {
  try {
    const data = await findMessages();
    const dataJson = JSON.parse(JSON.stringify(data));
    /* normalizador */
    const normalizedData = normalize(dataJson, [messages]);

    return normalizedData;
  } catch (error) {
    logger.log("error", `Error al obtener mensajes del controller: ${error}`);
  }
};

const instertMessageController = async (newMessage) => {
  try {
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
    return await insertMessage(data);
  } catch (error) {
    logger.log("error", `Error al insertar mensaje en controller: ${error}`);
  }
};

export { getMessagesController, instertMessageController };
