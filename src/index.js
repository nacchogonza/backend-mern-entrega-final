import express from "express";
import cluster from "cluster";
import os from "os";
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
import compression from "compression";
import {logger} from "./logger.js";

import cookieParser from "cookie-parser";
import session from "express-session";

import MongoStore from "connect-mongo";

/* PASSPORT */
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";

import { fork } from "child_process";

const MODE = process.argv[5] || "FORK";

let server;

const numCPUs = os.cpus().length;
const PORT = parseInt(process.argv[2]) || parseInt(process.argv[4]) || 8080;

  // CLUSTER
  if (MODE == "CLUSTER" && cluster.isMaster) {
    logger.log('warn', `Numero de CPUs: ${numCPUs}`);
    logger.log('warn', `PID MASTER ${process.pid}`);

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

const FACEBOOK_CLIENT_ID = "338084257980781";
const FACEBOOK_CLIENT_SECRET = "4fadfe8cb02f106f14977498ecca14eb";

passport.use(
  "login",
  new FacebookStrategy(
    {
      clientID: process.argv[2] || FACEBOOK_CLIENT_ID,
      clientSecret: process.argv[3] || FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "emails"],
      scope: ["email"],
    },
    (accessToken, refreshToken, profile, done) => {
      logger.log('info', `User Profile: ${profile}`);
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (obj, done) {
  done(null, obj);
});

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

process.on("exit", (code) => {
  logger.log('warn', `Servidor cerrado con código: ${code}`);
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

// app.use("/", express.static("public"));

io.on("connection", async (socket) => {
  logger.log('info', "Nuevo cliente conectado!");

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

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", isAuth, async (req, res) => {
  res.redirect("/home");
});

// LOGIN
app.get("/login", (req, res) => {
  res.render("pages/loginFacebook");
});

/* FACEBOOK LOGIN */

app.get("/auth/facebook", passport.authenticate("login"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/faillogin",
  })
);

// app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/home' }))

app.get("/faillogin", (req, res) => {
  res.render("pages/login-error", {});
});

app.get("/home", isAuth, async (req, res) => {
  const data = await findProducts();
  res.render("pages/products", {
    products: data,
    user: req.session.passport.user,
  });
});

app.get("/vista", async (req, res) => {
  let cant;
  const cantParam = parseInt(req.query.cant);
  isNaN(cantParam) ? (cant = 10) : (cant = cantParam);
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

const randoms_child = fork("./src/randoms.js");

app.get("/randoms", (req, res) => {
  const cant = req.query.cant;

  randoms_child.send(["start", cant]);
  randoms_child.on("message", (randoms) => {
    res.end("Ok: " + randoms);
  });
});

/* Process Info Route */
app.get("/info", (req, res) => {
  res.send(`
    Argumentos de entrada: ${process.argv}<br>
    Plataforma: ${process.platform}<br>
    Version de Node: ${process.version}<br>
    ID del proceso: ${process.pid}<br>
    Directorio de Trabajo: ${process.cwd()}<br>
    Directorio de Ejecucion: ${process.argv[0]}<br>
    Cantidad de procesadores en el : ${os.cpus().length}<br>
  `);
});

app.get("/infozip", compression(), (req, res) => {
  res.send(`
    Argumentos de entrada: ${process.argv}<br>
    Plataforma: ${process.platform}<br>
    Version de Node: ${process.version}<br>
    ID del proceso: ${process.pid}<br>
    Directorio de Trabajo: ${process.cwd()}<br>
    Directorio de Ejecucion: ${process.argv[0]}<br>
    Cantidad de procesadores en el : ${os.cpus().length}<br>
  `);
});

/* EXIT Test Route */
app.get("/exit", (req, res) => {
  process.exit();
});

app.get("/logout", async (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

server = httpServer.listen(PORT, () => {
  logger.log('info', `servidor inicializado en ${server.address().port}`);
});

server.on("error", (error) =>
  logger.log('error', `error en el servidor: ${error.message}`)
);
  }

