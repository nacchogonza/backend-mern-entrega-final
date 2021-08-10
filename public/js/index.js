
const socket = io.connect();

/* socket.on('productos', productos => {
  if (!productos.length) {
    htmlNoProducts = `
    <div style="overflow: hidden; box-sizing: border-box; text-align: center;">
      <div class="bg-warning" style="padding: 5px; text-align: center;">
        <h3>No se encontraron productos cargados</h1>
      </div>
    </div>
    `;
    document.getElementById("tablaDeProductos").innerHTML = htmlNoProducts
    return
  }
  let htmlCode = productos.map(product => (
    `
      <tr>
        <td style="vertical-align: middle;">${product.title}</td>
        <td style="vertical-align: middle;">$ ${product.price}</td>
        <td class="w-25">
          <img src=${product.thumbnail} style="width: 50px;" />
        </td>
      </tr>
    `
    )).join(" ")
  document.getElementById("tablaDeProductos").innerHTML = htmlCode
}) */

const dataProductos = fetch('/graphql?query={products {title, price, thumbnail}}')
  .then(res => res.json())
  .then(data => {
    const {data: { products }} = data
    if (!products.length) {
      htmlNoProducts = `
      <div style="overflow: hidden; box-sizing: border-box; text-align: center;">
        <div class="bg-warning" style="padding: 5px; text-align: center;">
          <h3>No se encontraron productos cargados</h1>
        </div>
      </div>
      `;
      document.getElementById("tablaDeProductos").innerHTML = htmlNoProducts
      return
    }
    let htmlCode = products.map(product => (
      `
        <tr>
          <td style="vertical-align: middle;">${product.title}</td>
          <td style="vertical-align: middle;">$ ${product.price}</td>
          <td class="w-25">
            <img src=${product.thumbnail} style="width: 50px;" />
          </td>
        </tr>
      `
      )).join(" ")
    document.getElementById("tablaDeProductos").innerHTML = htmlCode
  })
  .catch(console.error)

const addProduct = async () => {
  let producto = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value
  }


  await fetch(`/graphql?`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: `
      mutation InsertProduct {
        insertProduct(title: "${producto.title}", thumbnail: "${producto.thumbnail}", price: ${producto.price}){
          title
          thumbnail
          price
        }
      }
      `
    })
  })
  .then(res => res.json())
  .then(data => console.log('producto agregado a base de datos!', data))
  .catch(console.error)

  // socket.emit('new-product', producto);

  document.getElementById('title').value = ''
  document.getElementById('price').value = ''
  document.getElementById('thumbnail').value = ''
  window.location.reload()
  return false;
}

socket.on('messages', data => {
  console.log('Normalized data: ', data)
  const normalizedDataLength = JSON.stringify(data).length
  console.log(`normalizedDataLength`, normalizedDataLength)
  
  const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'email'})
  const messages = new normalizr.schema.Entity('messages', {
    author: schemaAuthor,
  }, {idAttribute: '_id'})

  if (data) {
    const denormalizedData = normalizr.denormalize(data.result, [messages], data.entities)
    console.log('Denormalized data: ', denormalizedData)
    const denormalizedDataLength = JSON.stringify(denormalizedData).length
    console.log(`denormalizedDataLength`, denormalizedDataLength)
    const compressionRate = (normalizedDataLength * 100) / denormalizedDataLength
    console.log(`compressionRate`, Math.round(100 - compressionRate))
    const html2 = `<h3>Porcentaje de compresión: ${Math.round(100 -compressionRate)}%</h3>`
    document.getElementById('compressionDiv').innerHTML = html2;
    render(denormalizedData);
  }
});

function render(data) {
    const html = data.map((elem, index) => {
      return(`<div>
            <span class="text-primary"><strong>${elem.author.email}</strong></span> <span style="color: brown;">${elem.date}</span>:
            <em>${elem.text}</em> <em><img src=${elem.text} alt="user avatar" /></em> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    const time = new Date();

    const mensaje = {
      email: document.getElementById('userEmail').value,
      nombre: document.getElementById('username').value,
      apellido: document.getElementById('userLastName').value,
      edad: document.getElementById('userAge').value,
      alias: document.getElementById('alias').value,
      avatar: document.getElementById('avatar').value,
      text: document.getElementById('texto').value,
      date: `(${time.getDate()}/${time.getMonth()}/${time.getFullYear()}) ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    };
    socket.emit('new-message', mensaje);

    document.getElementById('texto').value = ''
    document.getElementById('texto').focus()

    return false;
}

function loginUser(e) {
  const user = document.getElementById('userLogin').value
  const password = document.getElementById('passwordLogin').value
  fetch('/login', {
    method: 'POST',
    body: {
      username: user,
      password
    },
    username: user,
    password
 })
  return false 
}

function signUpUser(e) {
  const user = document.getElementById('userSignIn').value
  const password = document.getElementById('passwordSignIn').value
  const direccion = document.getElementById('direccionSignIn').value
  window.location.assign(`/login?username=${user}&password=${password}`)
  return false 
}