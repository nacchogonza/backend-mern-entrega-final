import config from '../config.js'
import express from "express";
import cluster from "cluster";
import os from "os";

import { Server as HttpServer } from "http";

import { logger } from "./logger.js";

import { graphqlHTTP } from "express-graphql";

import { buildSchema } from "graphql";

import RouterProductos from './routes/productosRouter.js'


const MODE = config.MODE;

let server;

const numCPUs = os.cpus().length;

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

  const app = express();
  const httpServer = new HttpServer(app);

  process.on("exit", (code) => {
    logger.log("warn", `Servidor cerrado con código: ${code}`);
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  const routerProductos = new RouterProductos();
  app.use("/api/productos", routerProductos.start())


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

  /* const getProducts = async () => {
    const dataGetProducts = await routerProductos.productosController.getProducts();
    return dataGetProducts;
  };

  const getProduct = async (id) => {
    const dataGetProduct = await FactoryPersistence.connection.buscar();
    return dataGetProduct;
  };

  const insertProduct = async ({ title, price, thumbnail }) => {
    const dataInsertProduct = await FactoryPersistence.connection.agregar({
      title,
      price,
      thumbnail,
    });
    return dataInsertProduct;
  }; */

  /* const root = {
    product: getProduct,
    products: getProducts,
    insertProduct: insertProduct,
  }; */
  /*  GRAPHQL */

  /* app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    })
  ); */

  server = httpServer.listen(config.PORT, () => {
    logger.log("info", `servidor inicializado en ${server.address().port}`);
  });

  server.on("error", (error) =>
    logger.log("error", `error en el servidor: ${error.message}`)
  );
}
