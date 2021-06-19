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

import cookieParser from "cookie-parser";
import session from "express-session";

import MongoStore from 'connect-mongo';

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const URL =
  "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce2?retryWrites=true&w=majority";

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/* CONEXION A DB MONGO */
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(session({
  store: MongoStore.create({
    mongoUrl: URL,
    mongoOptions: advancedOptions,
  }),
  secret: 'shhhhhhhhhhhhhhhhhhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 10 /* TIEMPO DE SESION: 10 MINUTOS */
  }
}))

app.set("view engine", "ejs");

app.use("/api", routerApi);

app.use("/", express.static("public"));

const auth = (req, res, next) => {
  if (req.session && req.session.user === 'nacho' && req.session.admin) {
    return next();
  } else {
    res.redirect("/")
  }
}

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
  res.render("pages/login");
});

app.get("/sign-up", async (req, res) => {
  const data = await findProducts();
  res.render("pages/register");
});

app.get("/home", auth, async (req, res) => {
  const data = await findProducts();
  res.render("pages/products", {
    products: data,
    user: req.session.user
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

app.get("/preLogout", auth, async (req, res) => {
  res.render("pages/preLogout", {
    user: req.session.user
  });
});

app.get('/login', (req, res) => {
  console.log(req.query)
  if (!req.query.username || !req.query.password) {
    res.send('login failed: username & password are required')
  } else if (req.query.username === 'nacho' || req.query.password === "123456") {
    req.session.user = "nacho";
    req.session.admin = true;
    res.redirect("/home")
  } else {
    res.send('login failed: wrong username or password')
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect("/")
  });
})

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`);
});

server.on("error", (error) =>
  console.log(`error en el servidor: ${error.message}`)
);
