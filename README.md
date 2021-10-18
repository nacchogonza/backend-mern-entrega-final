# backend-mern-entrega-final

## Ejecucion del Servidor
`npm run prod`

## Rutas
(Donde no se aclara el método el mismo es GET)
- usuariosRouter: Contiene las rutas a ser utilizadas en el frontend (EJS) entre las que se encuentran:
  - "/": comprueba el token y redirecciona al login en caso de que no haya token
  - "/productos": Pagina principal con productos del listado
  - "/productos/:categoria": Pagina para filtrado de productos por categoria
  - "/chat": Pagina con chat via web socket. Si el mensaje es de usuario se ubica a la izquierda, si es de sistema a la derecha
  - "/chat/:email": pagina para visualizar solo los mensajes del usuario logueado (Accesible via /chat con el boton de "Ver mis Mensajes")
  - "/carrito": Pagina para mostrar el carrito del usuario logueado
  - "/loginPage": Vista para realizar el login
  - "/login" (POST): Endpoint para realizar el POST al login via DB
  - "/registerPage": Vista para realizar el registro de usuario
  - "/register" (POST): Endpoint para realizar el POST al registro de nuevo usuario via DB

- carritosRouter: 
  - "/": devuelve el listado de carritos
  - "/:email": devuelve el carrito generado para un mail/usuario determinado, en caso de existir
  - "/" (POST): insertar producto al carrito evaluando si ya hay carrito existente para ese usuario o si se debe generar uno nuevo. Recibe como BODY el json del producto completo
  - "/" (DELETE): Eliminar producto del carrito para el usuario que este autenticado. Recibe como BODY el json del producto completo
  - "/:id" (DELETE): Eliminar un carrito determinado a partir de su id

- mensajesRouter:
  - "/": devuelve el listado de mensajes de la DB
  - "/:id": devuelve un mensaje a partir de su id
  - "/usuario/:email": devuelve los mensajes de un usuario determinado a visualizarse en su pagina de mensajes
  - "/" (POST): endpoint para insertar un nuevo mensaje en la DB
  - "/:id" (DELETE): endpoint para eliminar un mensaje a partir de su id

- productosRouter:
  - "/": Devuelve el listado de productos de la DB
  - "/:id": devuelve un producto en particular a partir de su id en caso de que exista
  - "/" (POST): endpoint para insertar un nuevo producto a la DB
  - "/:id" (PUT): endpoint para modificar un producto ya existente a partir de su id
  - "/:id" (DELETE): endpoint para eliminar un producto determinado a partir de su id

- ordenesRouter:
  - "/": Devuelve las ordenes existentes en DB
  - "/:id": Devuelve una orden especifica a partir de su id en caso de existir
  - "/" (POST): endpoint para generar una orden nueva a partir de un carrito. Recibe como body el carrito completo y luego lo elimina al generar la nueva orden
  - "/" (PUT): endpoint para modificar una orden (ej: cambiar el estado). recibe como body el json de la orden
  - "/:id" (DELETE): elimina una orden en particular a partir de su id

## Comentarios / Consideraciones
- en el archivo `production.env` se encuentran todos los datos y variables de entorno necesarios para la ejecucion del servidor
