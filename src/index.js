import express from "express";
import cluster from "cluster";
import os from "os";

import { routerApi } from "./router/RouterApi.js";
import { routerPassport } from "./router/routerPassport.js";

import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { connectDB } from "./db/mongoDB.js";

import { sendSms, getWordPosition } from "./controller/senderFunctions.js";

import { logger } from "./controller/logger.js";

import cookieParser from "cookie-parser";
import session from "express-session";

import MongoStore from "connect-mongo";

/* PASSPORT */
import passport from "passport";
import {
  getMessagesController,
  getProductController,
  getProductsController,
  insertProductController,
  instertMessageController,
} from "./controller/controllers.js";

import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const MODE = process.argv[5] || "FORK";

let server;

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 8080;

// CLUSTER
if (MODE == "CLUSTER" && cluster.isMaster) {
  logger.log("warn", `Numero de CPUs: ${numCPUs}`);
  logger.log("warn", `PID MASTER ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(
      "Worker",
      worker.process.pid,
      "died",
      new Date().toLocaleString()
    );
    cluster.fork();
  });
} else {
  //const usuarios = [];

  const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
  const URL =
    "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce2?retryWrites=true&w=majority";

  const app = express();
  const httpServer = new HttpServer(app);
  const io = new IOServer(httpServer);

  process.on("exit", (code) => {
    logger.log("warn", `Servidor cerrado con código: ${code}`);
  });

  /* CONEXION A DB MONGO */
  connectDB();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: URL,
        mongoOptions: advancedOptions,
      }),
      secret: "shhhhhhhhhhhhhhhhhhhhh",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 10 /* TIEMPO DE SESION: 10 MINUTOS */,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.set("view engine", "ejs");

  app.use("/api", routerApi);
  app.use("/", routerPassport);

  app.use("/", express.static("public"));

  /*  GRAPHQL */
  const schema = buildSchema(`
    type Query {
      product(_id: String!): Product
      products: [Product]
    },
    type Mutation {
      insertProduct(title: String, price: Float, thumbnail: String): Product
    },
    type Product {
      _id: String
      title: String
      price: Float
      thumbnail: String
    }
`);

  const getProducts = async () => {
    const dataGetProducts = await getProductsController();
    return dataGetProducts;
  };

  const getProduct = async (id) => {
    const dataGetProduct = await getProductController(id);
    return dataGetProduct;
  };

  const insertProduct = async ({title, price, thumbnail}) => {
    
    /* MUTATION EXAMPLE */
    /* 
      mutation InsertProduct($title: String, $thumbnail: String, $price: Float) {
        insertProduct(title: $title, thumbnail: $thumbnail, price: $price){
          title
          thumbnail
          price
        }
      }
    */

    const dataInsertProduct = await insertProductController({
      title,
      price,
      thumbnail
    });
    return dataInsertProduct;
  };


  const root = {
    product: getProduct,
    products: getProducts,
    insertProduct: insertProduct
  };
  /*  GRAPHQL */

  app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  }));

  io.on("connection", async (socket) => {
    logger.log("info", "Nuevo cliente conectado!");

    socket.emit("productos", await getProductsController());

    socket.emit("messages", await getMessagesController());

    socket.on("new-product", async (product) => {
      await insertProductController(product);
      socket.emit("productos", await getProductsController());
    });

    socket.on("new-message", async (data) => {
      if (getWordPosition("administrador", data.text) !== -1) {
        await sendSms(data);
      }
      await instertMessageController(data);
      socket.emit("messages", await getMessagesController());
    });
  });

  server = httpServer.listen(PORT, () => {
    logger.log("info", `servidor inicializado en ${server.address().port}`);
  });

  server.on("error", (error) =>
    logger.log("error", `error en el servidor: ${error.message}`)
  );
}
