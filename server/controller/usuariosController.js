import ApiUsuarios from "../api/usuariosApi.js";
import { generateToken, isValidPassword } from "../utils/functions.js";
import config from "../../config.js";
import { sendGmailEmail } from "../utils/senderGmail.js";

class UsuariosController {
  constructor() {
    this.apiUsuarios = new ApiUsuarios();
  }

  loginUserController = async (req, res) => {
    try {
      const { useremail, password, isBrowser } = req.body;
      const usuarios = await this.apiUsuarios.getUsers();
      const user = usuarios.find((currentUser) => currentUser.useremail === useremail);
      if (!user) {
        console.log("El usuario ingresado no está registrado");
        if (isBrowser) {
          res.status(500).render("login-error.ejs");
        } else {
          res.status(500).json({
            error: "error al autenticar usuario, el email no está registrado",
          });
        }
      }
      console.log(`user`, user)
      if (!isValidPassword(user, password)) {
        console.log("Password inválida");
        if (isBrowser) {
          res.status(403).render("login-error.ejs");
        } else {
          res
            .status(403)
            .json({ error: "error al generar token, password inválida" });
        }const mailOptionsGmail = {
          from: "Servidor Eccomerce",
          to: MAIL_ADMIN,
          subject: `Nuevo pedido de ${user.nombre} (${user.username})`,
          html: `
            <h2>Nuevo Pedido confirmado de ${user.nombre} (${user.username})</h2>
            <h3>Lista de Productos:</h3>
            <ul>
              ${productsList}
            </ul>
          `,
        };
    
        sendGmailEmail(mailOptionsGmail);
      }
      const token = generateToken(user);
      if (!token) {
        if (isBrowser) {
          res.status(403).render("login-error.ejs");
        } else {
          res.status(403).json({ error: "error al generar token" });
        }
      } else {
        req.session.token = token;
        if (isBrowser) {
          res.status(200).redirect("/productos");
        } else {
          res.status(200).json({ token });
        }
      }
    } catch (error) {
      console.log("error getProducts controller: ", error);
    }
  };

  registerUserController = async (req, res) => {
    try {
      const {
        username,
        useremail,
        userphone,
        useraddress,
        password,
        passwordRepeat,
        isBrowser,
      } = req.body;

      if (password !== passwordRepeat) {
        if (isBrowser) {
          res.status(500).render("register-error.ejs");
          return;
        } else {
          res.status(500).json({
            error: "error al registrar usuario, las contraseñas no coinciden",
          });
          return;
        }
      }

      const users = await this.apiUsuarios.getUsers();
      const user = users.find((user) => user.useremail === useremail);
      if (user) {
        console.log("el usuario ya esta registrado");
        if (isBrowser) {
          res.status(500).render("register-error.ejs");
          return;
        } else {
          res
            .status(500)
            .json({ error: "error al registrar usuario, email ya registrado" });
          return;
        }
      } else {
        const nuevoUsuario = await this.apiUsuarios.postUser(
          username,
          useremail,
          userphone,
          useraddress,
          password
        );
        if (!nuevoUsuario) {
          if (isBrowser) {
            res.status(500).render("register-error.ejs");
          } else {
            res.status(500).json({ error: "error al registrar usuario en DB" });
          }
        } else {
          const mailOptionsGmail = {
            from: "Servidor Eccomerce",
            to: config.ADMIN_EMAIL,
            subject: "Nuevo Registro de Usuario",
            html: `
              <h2>Nuevo Usuario Registrado!</h2>
              <p>Usuario: ${username}</p>
              <p>Email: ${useremail}</p>
              <p>Direccion: ${useraddress}</p>
              <p>Telefono: ${userphone}</p>
            `,
          };
      
          sendGmailEmail(mailOptionsGmail);
          if (isBrowser) {
            console.log("usuario registrado correctamente!");
            res.status(200).redirect("/loginPage");
          } else {
            console.log("usuario registrado correctamente!");
            res.status(200).json(nuevoUsuario);
          }
        }
      }
    } catch (error) {
      console.log("error registerUser controller: ", error);
    }
  };
}

export default UsuariosController;
