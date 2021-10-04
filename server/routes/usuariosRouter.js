import express from 'express';
const router = express.Router();

import UsuariosController from '../controller/usuariosController.js';
import { verifyJWT } from '../utils/functions.js';

class RouterUsuarios {
  constructor() {
    this.usuariosController = new UsuariosController(); // inicializar el controller
  }

  start() {
    router.get('/', verifyJWT, (req, res) => {
      res.redirect("/loginPage");
    })
    router.get('/productos',  verifyJWT, (req, res) => {
      res.render('products.ejs', {
        username: req.user.username,
        useremail: req.user.useremail,
        userphone: req.user.userphone,
        useraddress: req.user.useraddress,
      })
    })

    router.get('/productos/:categoria',  verifyJWT, (req, res) => {
      const category = req.params.categoria
      res.render('productsByCategory.ejs', {
        username: req.user.username,
        useremail: req.user.useremail,
        userphone: req.user.userphone,
        useraddress: req.user.useraddress,
        category
      })
    })
    router.get('/chat', verifyJWT, (req, res) => {
      res.render('chat.ejs')
    })

    router.get('/loginPage', (req, res) => {
      res.render("login.ejs");
    })
    router.post('/login', this.usuariosController.loginUserController)

    router.get('/registerPage', (req, res) => {
      res.render("register.ejs");
    })
    router.post('/register', this.usuariosController.registerUserController)
    
    return router
  }
}

export default RouterUsuarios;