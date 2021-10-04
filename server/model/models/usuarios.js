import Joi from "joi";

class Usuarios {
  constructor(username, useremail, userphone, useraddress, password) {
    this.username = username;
    this.useremail = useremail;
    this.userphone = userphone;
    this.password = password;
    this.useraddress = useraddress;
  }

  static validar(noticia, requerido) {
    const UsuarioSchema = Joi.object({
      username: requerido ? Joi.string().required() : Joi.string(),
      useremail: requerido ? Joi.string().required() : Joi.string(),
      userphone: requerido ? Joi.string().required() : Joi.string(),
      password: requerido ? Joi.string().required() : Joi.string(),
      useraddress: requerido ? Joi.string().required() : Joi.string(),
    });

    const { error } = UsuarioSchema.validate(noticia);
    if (error) {
      throw error;
    }
  }
}

export default Usuarios;
