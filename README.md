# backend-mern-entrega-final

## Ejecucion del Servidor
`npm run prod`

## Rutas
- usuariosRouter: Contiene las rutas a ser utilizadas en el frontend (EJS) entre las que se encuentran:
  - "/": comprueba el token y redirecciona al login en caso de que no haya token
  - "/productos": Pagina principal con productos del listado
  - "/productos/:categoria": Pagina para filtrado de productos por categoria
  - "/chat": Pagina con chat via web socket. Si el mensaje es de usuario se ubica a la izquierda, si es de sistema a la derecha
  - "/chat/:email": pagina para visualizar solo los mensajes del usuario logueado (Accesible via /chat con el boton de "Ver mis Mensajes")
  - "/carrito": Pagina para mostrar el carrito del usuario logueado
  - "/loginPage": Vista para realizar el login
  - "/login": Endpoint para realizar el POST al login via DB
  - "/registerPage": Vista para realizar el registro de usuario
  - "/register": Endpoint para realizar el POST al registro de nuevo usuario via DB
