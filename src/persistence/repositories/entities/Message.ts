export class Message {
    private author: Author;
    private text: string;
    private date: string;
  
    constructor(email: string, nombre: string, apellido: string, edad: number, alias: string, avatar: string, text: string, date: string) {
      this.author = new Author(email, nombre, apellido, edad, alias, avatar)
      this.text = text;
      this.date = date;
    }
}

class Author {
  private email: string;
  private nombre: string;
  private apellido: string;
  private edad: number;
  private alias: string;
  private avatar: string;

  constructor(email: string, nombre: string, apellido: string, edad: number, alias: string, avatar: string) {
    this.email = email;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.alias = alias;
    this.avatar = avatar;
  }
}
