import express from "express";
import faker from "faker";
import compression from "compression";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { logger } from "../controller/logger.js";
import {
  sendEtherealEmail,
  sendGmailEmail,
} from "../controller/senderFunctions.js";

import FactoryPersistence from '../persistence/factory/dbFactory.js';

const routerPassport = express.Router();
routerPassport.use(express.json());
routerPassport.use(express.urlencoded({ extended: true }));

/* PASSPORT FB CONFIG */

const FACEBOOK_CLIENT_ID = "155027036736895";
const FACEBOOK_CLIENT_SECRET = "f268971ed09caf5144ac0db13cf8fad9";

passport.use(
  "login",
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "emails"],
      scope: ["email"],
    },
    (accessToken, refreshToken, profile, done) => {
      logger.log("info", `User Profile: ${profile}`);

      // SEND LOGIN EMAIL
      const mailOptionsEthereal = {
        from: "Servidor Backend - Inicio de Sesion con Facebook",
        to: "telly89@ethereal.email",
        subject: "Usuario inicio sesión con facebook",
        html: `<h2>Log In</h2><p>Usuario: ${
          profile.displayName
        }</p><p>Horario: ${new Date()}</p>`,
      };

      const mailOptionsGmail = {
        from: "Servidor Backend - Inicio de Sesion con Facebook",
        to: "nachomgonzalez93@gmail.com",
        subject: "Usuario inicio sesión con facebook",
        html: `<h2>Log In</h2><p>Usuario: ${
          profile.displayName
        }</p><p>Horario: ${new Date()}</p>`,
        attachments: [{ path: profile.photos[0].value }],
      };

      sendEtherealEmail(mailOptionsEthereal);
      sendGmailEmail(mailOptionsGmail);

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

/* PASSPORT FB CONFIG */

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

routerPassport.get("/", isAuth, async (req, res) => {
  res.redirect("/home");
});

// LOGIN
routerPassport.get("/login", (req, res) => {
  res.render("pages/loginFacebook");
});

/* FACEBOOK LOGIN */

routerPassport.get("/auth/facebook", passport.authenticate("login"));

routerPassport.get(
  "/auth/facebook/callback",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/faillogin",
  })
);

routerPassport.get("/faillogin", (req, res) => {
  res.render("pages/login-error", {});
});

routerPassport.get("/home", isAuth, async (req, res) => {
  const data = await FactoryPersistence.connection.buscar();
  res.render("pages/products", {
    products: data,
    user: req.session.passport.user,
  });
});

routerPassport.get("/vista", async (req, res) => {
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

routerPassport.get("/info", (req, res) => {
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

routerPassport.get("/info-console", (req, res) => {
  console.log("Example console log");
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

routerPassport.get("/infozip", compression(), (req, res) => {
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
routerPassport.get("/exit", (req, res) => {
  process.exit();
});

routerPassport.get("/logout", async (req, res) => {
  // SEND LOGIN EMAIL
  const mailOptions = {
    from: "Servidor Backend - Cierre de Sesion con Facebook",
    to: "telly89@ethereal.email",
    subject: "Usuario cerró sesión con facebook",
    html:
      process.argv[3] ||
      `<h2>Log Out</h2><p>Usuario: ${
        req.session.passport.user.displayName
      }</p><p>Horario: ${new Date()}</p>`,
  };

  sendEtherealEmail(mailOptions);
  req.logout();
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

export { routerPassport };
