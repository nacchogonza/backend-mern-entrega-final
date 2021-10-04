import ApiOrdenes from "../api/ordenesApi.js";
import ApiCarritos from '../api/carritosApi.js';
import ApiProductos from "../api/productosApi.js";

class OrdenesController {
  constructor() {
    this.apiCarritos = new ApiCarritos();
    this.apiOrdenes = new ApiOrdenes();
    this.apiProductos = new ApiProductos();
  }

  getOrdersController = async (req, res) => {
    try {
      const id = req.params.id;
      const ordenes = await this.apiOrdenes.getOrders(id);
      res.send(ordenes);
    } catch (error) {
      console.log("error getOrders controller: ", error);
    }
  };

  generateOrderController = async (req, res) => {
    try {
      const user = req.user;
      const carrito = req.body;
      const ordenes = await this.apiOrdenes.getOrders();

      let orderAmount = 0;

      const updatedProducts = await this.apiProductos.getProductos();
      const orderItems = carrito.productos.map(currentProduct => {
        const updatedProduct = updatedProducts.find(product => product._id == currentProduct.product._id);

        /* CASO EN QUE SE HUBIERA ELIMINADO EL PRODUCTO QUE FIGURABA EN EL CARRITO */
        if (!updatedProduct) {
          return null
        }

        const orderItem = {
          productName: currentProduct.product.title,
          productDescription: currentProduct.product.description,
          productQuantity: currentProduct.quantity,
          productPrice: updatedProduct.price,
        }
        orderAmount = orderAmount + (updatedProduct.price * currentProduct.quantity)
        return orderItem;
      })

      const newOrder = {
        items: orderItems,
        orderNumber: ordenes.length + 1,
        timestamp: new Date(),
        status: 'GENERADA',
        email: user.useremail,
        shippingAddress: user.useraddress,
        mount: orderAmount
      }
      const orden = await this.apiOrdenes.postOrder(newOrder);

      /* SI LA ORDEN SE GENERA CORRECTAMENTE, SE ELIMINA POR CONSECUENCIA EL CARRITO UTILIZADO PARA GENERARLA */
      if (orden) {
        await this.apiCarritos.deleteCart(carrito._id)
        console.log(`Carrito ${carrito._id} eliminado por generación de orden`)
      }
      res.send(orden);
    } catch (error) {
      console.log("error getProducts controller: ", error);
    }
  }


  putOrderController = async (req, res) => {
    try {
      const order = req.body;
      const updatedOrder = await this.apiOrdenes.putOrder(order);
      res.send(updatedOrder);
    } catch (error) {
      console.log("error getProducts controller: ", error);
    }
  }

  deleteOrderController = async (req, res) => {
    try {
      const id = req.params.id;
      const deletedOrder = await this.apiOrdenes.deleteOrder(id);
      res.send(deletedOrder);
    } catch (error) {
      console.log("error getProducts controller: ", error);
    }
  }

  deleteCart = async (req, res) => {
    try {
      const id = req.params.id;
      const carritoEliminado = await this.apiCarritos.deleteCart(id);
      res.send(carritoEliminado);
    } catch (error) {
      console.log("error getProducts controller: ", error);
    }
  }
}

export default OrdenesController;
