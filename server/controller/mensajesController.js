import ApiMensajes from "../api/mensajesApi.js";
import ApiProductos from "../api/productosApi.js";

class MensajesController {
  constructor() {
    this.apiMensajes = new ApiMensajes();
  }

  getMessagesController = async (req, res) => {
    try {
      const id = req.params.id;
      const productos = await this.apiMensajes.getMessages(id);
      res.send(productos);
    } catch (error) {
      console.log("error getMessagesController controller: ", error);
    }
  };

  getMessagesByUserController = async (req, res) => {
    try {
      const userEmail = req.params.email;
      const messages = await this.apiMensajes.getMessages();
      const userMessages = messages.filter(currentMessage => currentMessage.email === userEmail)
      res.status(200).json(userMessages)
    } catch (error) {
      console.log("error getMessagesByUserController controller: ", error);
      res.status(500).json({error: "error getMessagesByUserController"})
    }
  }

  postMessageController = async (req, res) => {
    try {
      let message = req.body;
      let postedMessage = await this.apiMensajes.postMessage(message);
      if (!postedMessage) {
        res.json({})
      } else {

        res.json(postedMessage);
      }
    } catch (error) {
      console.log("error postMessageController: ", error);
    }
  }

  deleteMessageController = async (req, res) => {
    try {
      const id = req.params.id;
      const mensaje = await this.apiMensajes.deleteMessage(id);
      res.send(mensaje);
    } catch (error) {
      console.log("error deleteMessageController controller: ", error);
    }
  };
}

export default MensajesController;
