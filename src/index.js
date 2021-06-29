import express from "express";
import bodyParser from "body-parser";
import { routerApi } from "./RouterApi.js";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import {
  connectDB,
  findMessages,
  insertMessage,
  findProducts,
  insertProduct,
  findUsuarios, 
  insertUsuario,
} from "../db/mongoDB.js";
import faker from "faker";

import cookieParser from "cookie-parser";
import session from "express-session";

import MongoStore from 'connect-mongo';

/* PASSPORT */
import bCrypt from 'bcrypt';
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as FacebookStrategy} from 'passport-facebook';

//const usuarios = [];

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const URL =
  "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce2?retryWrites=true&w=majority";

passport.use('register', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {

  const { direccion } = req.body

  const usuarios = await findUsuarios();

  const usuario = usuarios.find(usuario => usuario.username == username)
  if (usuario) {
    return done('already registered')
  }

  const user = {
    username,
    password,
    direccion,
  }
  await insertUsuario(user)

  return done(null, user)
}));

passport.use('login', new FacebookStrategy({
  clientID: '338084257980781',
  clientSecret: '4fadfe8cb02f106f14977498ecca14eb',
  callbackURL: 'http://localhost:8080/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'emails'],
  scope: ['email']
}, (accessToken, refreshToken, profile, done) => {
  console.log('User Profile: ', profile)
  return done(null, profile);
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (obj, done) {
  // const usuarios = await findUsuarios();
  // const usuario = usuarios.find(usuario => usuario.username == username)
  done(null, obj);
});

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
    maxAge: 1000 * 60 * 10, /* TIEMPO DE SESION: 10 MINUTOS */
  }
}))

app.use(passport.initialize());
app.use(passport.session());

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

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

app.get("/", isAuth, async (req, res) => {
  res.redirect('/home')
});

// LOGIN
app.get('/login', (req, res) => {
  res.render('pages/loginFacebook');
})

app.get('/auth/facebook', passport.authenticate('login'));

app.get('/auth/facebook/callback', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/faillogin'
}));

// app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/home' }))

app.get('/faillogin', (req, res) => {
  res.render('pages/login-error', {});
})


app.get('/register', (req, res) => {
  res.render("pages/register");
})

app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/' }))

app.get('/failregister', (req, res) => {
  res.render('pages/register-error', {});
})

/* FACEBOOK LOGIN */

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/faillogin'
}));

app.get('/faillogin', (req, res) => {
    res.render('login-error', {});
})

app.get("/home", isAuth, async (req, res) => {
  const data = await findProducts();
  res.render("pages/products", {
    products: data,
    user: req.session.passport.user
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

app.get("/logout", async (req, res) => {
    req.logout();
    req.session.destroy(err => {
      res.redirect("/")
    });
});

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
  console.log(`servidor inicializado en ${server.address().port}`);
});

server.on("error", (error) =>
  console.log(`error en el servidor: ${error.message}`)
);
