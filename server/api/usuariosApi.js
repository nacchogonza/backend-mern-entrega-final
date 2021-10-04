import config from "../../config.js";
import UsuariosDBMongoDAO from "../model/DAOs/usuarios/usuariosDBMongo.js";
import Usuarios from "../model/models/usuarios.js";
import { createHash } from "../utils/functions.js";

class ApiUsuarios {
  constructor() {
    this.usuariosDao = new UsuariosDBMongoDAO("ecommerce2", "usuarios");
  }

  async getUsers () {
    return await this.usuariosDao.getUsers()
  }

  async postUser(
    username,
    useremail,
    userphone,
    useraddress,
    password
  ) {
    const validateResult = ApiUsuarios.asegurarUsuarioValido(
      { username, useremail, userphone, useraddress, password },
      true
    );
    if (!validateResult) {
      return validateResult;
    }
    return await this.usuariosDao.postUser({
      username,
      useremail,
      userphone,
      useraddress,
      password: createHash(password)
    });
  }

  static asegurarUsuarioValido(usuario, requerido) {
    try {
      Usuarios.validar(usuario, requerido);
      return true;
    } catch (error) {
      console.log(
        "el usuario no posee un formato json invalido o faltan datos: " +
          error.details[0].message
      );
      return null;
    }
  }
}

export default ApiUsuarios;
