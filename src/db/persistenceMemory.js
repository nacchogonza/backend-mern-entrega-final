export class persistenceMemory {
  constructor() {
    this.productos = [];
    this.mensajes = [];
  }

  /* MESSAGES FUNCTIONS */

  findMessages = () => {
    return this.mensajes;
  };

  insertMessage = (newMessage) => {
    const id = this.mensajes.length + 1;
    newMessage.id = id;
    this.mensajes.push(newMessage);
    return newMessage;
  };

  /* PRODUCTS FUNCTIONS */

  findProducts = async () => {
    return this.productos;
  };

  findProduct = async (id) => {
    const product = this.productos.find((producto) => producto.id == id);
    return product;
  };

  putProduct = async (updateProduct, id) => {
    const product = this.productos.find((producto) => producto.id == id);
    if (!product) return product;
    product.title = updateProduct.title;
    product.price = updateProduct.price;
    product.thumbnail = updateProduct.thumbnail;
    return product;
  };

  removeProduct = async (id) => {
    const product = this.productos.find((producto) => producto.id == id);
    if (!product) return product;
    const newProductsArray = this.productos.filter(
      (producto) => producto.id != id
    );
    this.productos = newProductsArray;
    return product;
  };

  insertProduct = async (newProduct) => {
    newProduct.id = this.productos.length + 1;
    this.productos.push(newProduct);
    return newProduct;
  };
}
