import express from "express";
import { routerApi } from "./RouterApi.js";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import {
  connectDB,
  findMessages,
  insertMessage,
  findProducts,
  insertProduct,
} from "../db/mongoDB.js";
import faker from "faker";

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/* CONEXION A DB MONGO */
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/api", routerApi);

app.use("/", express.static("public"));

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado!");

  socket.emit("productos", await findProducts());

  socket.emit("messages", await findMessages());

  socket.on("new-product", async (product) => {
    await insertProduct(product);
    socket.emit("productos", await findProducts());
  });

  socket.on("new-message", async (data) => {
    await insertMessage(data);
    socket.emit("messages", await findMessages());
  });
});

app.get("/", async (req, res) => {
  const data = await findProducts();
  res.render("pages/products", {
    products: data,
  });
});

app.get("/vista", async (req, res) => {
  let cant;
  const cantParam = parseInt(req.query.cant);
  isNaN(cantParam) ? cant = 10 : cant = cantParam
  const data = [];
  for (let i = 1; i < cant + 1; i++) {
    const object = {
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.random.image(),
    };
    data.push(object);
  }
  res.render("pages/productsMock", {
    productsMock: data,
  });
});

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`);
});

server.on("error", (error) =>
  console.log(`error en el servidor: ${error.message}`)
);
