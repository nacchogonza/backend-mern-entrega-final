

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const tokenSecret = "my-token-secret";

export const verifyJWT = (req, res, next) => {
  let token;
  if (req.session.token) {
    token = `Bearer ${req.session.token}`;
  }
  if (!token) {
    token = req.headers.authorization;
  }

  if (!token) {
    console.log("no se encontró token, redireccionando al login");
    res.status(403).redirect("/loginPage");
  } else {
    jwt.verify(token.split(" ")[1], tokenSecret, (err, value) => {
      if (err) {
        console.log(
          "error con el token de autenticacion, redireccionando al login"
        );
        // res.status(500).redirect("/loginPage");
        res.status(500).json({error: "error con el token de autenticacion, redireccionando al login"});
        return;
      }
      if (value && value.data) {
        req.user = value.data;
      }
      next();
    });
  }
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

export const generateToken = (user) => {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "24h" });
};
