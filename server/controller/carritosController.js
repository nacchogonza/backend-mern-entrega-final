import ApiCarritos from "../api/carritosApi.js";

class CarritosController {
  constructor() {
    this.apiCarritos = new ApiCarritos();
  }

  getCarts = async (req, res) => {
    try {
      const id = req.params.id;
      const carritos = await this.apiCarritos.getCarts(id);
      res.send(carritos);
    } catch (error) {
      console.log("error getProducts controller: ", error);
    }
  };

  getCartByUser = async (req, res) => {
    try {
      const user = req.user
      const userEmail = req.params.email;
      if (user.useremail !== userEmail) {
        res.status(500).json({
          error: "el mail solicitado no coincide con el usuario logueado",
        });
        return;
      }
      const carritos = await this.apiCarritos.getCarts();
      const userCart = carritos.find(
        (currentCart) => currentCart.useremail === userEmail
      );
      res.status(200).json(userCart);
    } catch (error) {
      console.log("error getCartByUser controller: ", error);
    }
  };

  insertProductCart = async (req, res) => {
    try {
      const user = req.user;
      const producto = req.body;
      const carts = await this.apiCarritos.getCarts();
      const userCart = carts.find((cart) => cart.useremail === user.useremail);
      if (!userCart) {
        const carrito = await this.apiCarritos.postProductCart({
          useremail: user.useremail,
          useraddress: user.useraddress,
          timestamp: Date.now(),
          productos: [
            {
              quantity: 1,
              product: {
                title: producto.title,
                price: Number(producto.price),
                description: producto.description,
                categoria: producto.categoria,
                thumbnail: producto.thumbnail,
              },
            },
          ],
        });
        if (producto.isBrowser) {
          res.redirect("/productos")
          return
        }
        res.send(carrito);
      } else {
        const auxProducts = userCart.productos;
        const productExists = auxProducts.find(
          (product) => product.product._id === producto._id
        );
        if (!productExists) {
          auxProducts.push({ quantity: 1, product: producto });
        } else {
          productExists.quantity++;
        }
        const carrito = await this.apiCarritos.putCart(
          userCart._id,
          auxProducts
        );
        if (producto.isBrowser) {
          res.redirect("/productos")
          return
        }
        res.send(carrito);
      }
    } catch (error) {
      console.log("error insertProductCart controller: ", error);
    }
  };

  deleteProductCart = async (req, res) => {
    try {
      const user = req.user;
      const productToDelete = req.body;
      const carts = await this.apiCarritos.getCarts();
      const userCart = carts.find((cart) => cart.useremail === user.useremail);
      if (!userCart) {
        res
          .status(500)
          .json({ error: "no existe carrito para el usuario indicado" });
      } else {
        const auxProducts = userCart.productos.filter(
          (product) => product.product._id !== productToDelete._id
        );
        if (!auxProducts.length) {
          await this.apiCarritos.deleteCart(userCart._id);
          console.log("carrito eliminado por falta de productos");
          res.send(userCart);
        } else {
          const carrito = await this.apiCarritos.putCart(
            userCart._id,
            auxProducts
          );
          res.send(carrito);
        }
      }
    } catch (error) {
      console.log("error deleteProductCart controller: ", error);
    }
  };

  deleteCart = async (req, res) => {
    try {
      const id = req.params.id;
      const carritoEliminado = await this.apiCarritos.deleteCart(id);
      res.send(carritoEliminado);
    } catch (error) {
      console.log("error deleteCart controller: ", error);
    }
  };
}

export default CarritosController;
