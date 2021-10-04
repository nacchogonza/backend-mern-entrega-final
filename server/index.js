import config from "../config.js";
import express from "express";
import cluster from "cluster";
import os from "os";
import hbs from 'express-handlebars'

import MongoStore from "connect-mongo";
import session from "express-session";

import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

import { logger } from "./logger.js";

import RouterProductos from "./routes/productosRouter.js";
import RouterMensajes from "./routes/mensajesRouter.js";
import RouterUsuarios from "./routes/usuariosRouter.js";

import { verifyJWT } from "./utils/functions.js";
import RouterCarritos from "./routes/carritosRouter.js";
import RouterOrdenes from "./routes/ordenesRouter.js";

const MODE = config.MODE;

let server;

const numCPUs = os.cpus().length;

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const URL = config.DB_URL;

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
  const io = new IOServer(httpServer);

  process.on("uncaughtException", (err) => {
    console.log(`Excepcion recogida: ${err}`);
  });

  process.on("exit", (code) => {
    console.log(`Servidor cerrado con código: ${code}`);
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.engine('hbs', hbs({
    extname: '.hbs',
    layoutsDir: process.cwd() + '/server/views/pages',
    defaultLayout: 'configs',
  }));
  app.set('view engine', 'hbs');
  app.set("views", process.cwd() + "/server/views/pages");

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
        maxAge: Number(config.SESSION_TIME) /* TIEMPO DE SESION: 10 MINUTOS */,
      },
    })
  );

  app.use("/", express.static("public"));

  const routerProductos = new RouterProductos();
  const routerMensajes = new RouterMensajes();
  const routerUsuarios = new RouterUsuarios();
  const routerCarritos = new RouterCarritos();
  const routerOrdenes = new RouterOrdenes();

  app.use("/api/productos", verifyJWT, routerProductos.start());
  app.use("/api/mensajes", verifyJWT, routerMensajes.start());
  app.use("/api/carritos", verifyJWT, routerCarritos.start());
  app.use("/api/ordenes", verifyJWT, routerOrdenes.start());
  app.use("/", routerUsuarios.start());

  app.get("/info", (req, res) => {
    res.render("info.pug", {
      arguments: process.argv,
      platform: process.platform,
      nodeVersion: process.version,
      memoryUssage: process.memoryUsage.rss(),
      processId: process.pid,
      workDirectory: process.cwd(),
      execDirectory: process.argv[0],
    });
  });
  app.get("/configs", (req, res) => {
    res.render("configs", {
      port: config.PORT,
      dbUrl: config.DB_URL,
      nodeEnv: config.NODE_ENV,
      execMode: config.MODE,
      sessionTime: config.SESSION_TIME,
      adminEmail: config.ADMIN_EMAIL,
    });
  });

  io.on("connection", async (socket) => {
    logger.log("info", "Nuevo cliente conectado al chat");

    if (
      routerMensajes.mensajesController.apiMensajes.mensajesDao
        .mensajesCollection
    ) {
      socket.emit(
        "messages",
        await routerMensajes.mensajesController.apiMensajes.getMessages()
      );
    }

    socket.on("new-message", async (data) => {
      await routerMensajes.mensajesController.apiMensajes.postMessage(data);
      socket.emit(
        "messages",
        await routerMensajes.mensajesController.apiMensajes.getMessages()
      );
    });
  });

  server = httpServer.listen(config.PORT, () => {
    logger.log("info", `servidor inicializado en ${server.address().port}`);
  });

  server.on("error", (error) =>
    logger.log("error", `error en el servidor: ${error.message}`)
  );
}
