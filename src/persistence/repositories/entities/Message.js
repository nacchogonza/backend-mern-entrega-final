export class Message {
  
    constructor(email, nombre, apellido, edad, alias, avatar, text, date) {
      this.author = new Author(email, nombre, apellido, edad, alias, avatar)
      this.text = text;
      this.date = date;
    }
}

class Author {

  constructor(email, nombre, apellido, edad, alias, avatar) {
    this.email = email;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.alias = alias;
    this.avatar = avatar;
  }
}
