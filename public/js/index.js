const socket = io.connect();

const addToCart = async (product) => {
  product.isBrowser = true
  console.log(product)
  const url = `/api/carrito`;
  /* await fetch(url, {
    method: "POST",
    body: {
      product,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log("producto agregado al carrito: ", json);
      // location.href = '/carrito.html'
    }); */
};

const dataProductos = fetch("/api/productos")
  .then((res) => res.json())
  .then((products) => {
    if (!products.length) {
      htmlNoProducts = `
      <div style="overflow: hidden; box-sizing: border-box; text-align: center;">
        <div class="bg-warning" style="padding: 5px; text-align: center;">
          <h3>No se encontraron productos cargados</h1>
        </div>
      </div>
      `;
      document.getElementById("tablaDeProductos").innerHTML = htmlNoProducts;
      return;
    }
    let htmlCode = products
      .map(
        (product) =>
          `
          <div class="col-md-4 pb-5">
          <div class="card" style="width: 15rem;">
            <img style="width: 5rem; height: 5rem;" class="card-img-top mx-auto d-block" src="${product.thumbnail}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p><b>Descripción:</b> ${product.description}</p>
              <p><b>Precio:</b> ${product.price}</p>
              <p><b>Code:</b> ${product.categoria}</p>
              <form action="/api/carritos" method="post">
                <input type="hidden" id="_id" name="_id" value="${product._id}" >
                <input type="hidden" id="title" name="title" value="${product.title}" >
                <input type="hidden" id="price" name="price" value="${product.price}" >
                <input type="hidden" id="description" name="description" value="${product.description}" >
                <input type="hidden" id="categoria" name="categoria" value="${product.categoria}" >
                <input type="hidden" id="thumbnail" name="thumbnail" value="${product.thumbnail}" >
                <input type="hidden" id="isBrowser" name="isBrowser" value="true" >
                <input class="btn btn-primary my-2" type="submit" value="Agregar al Carrito">
              </form>
            </div>
          </div>
        </div>
      `
      )
      .join(" ");
    document.getElementById("tablaDeProductos").innerHTML = htmlCode;
  })
  .catch(console.error);

const addProduct = async () => {
  let producto = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    categoria: document.getElementById("categoria").value,
    description: document.getElementById("description").value,
  };

  console.log(producto);

  await fetch(`/api/productos`, {
    method: "POST",
    body: { producto },
  })
    .then((res) => res.json())
    .then((data) => console.log("producto agregado a base de datos!", data))
    .catch(console.error);

  document.getElementById("title").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnail").value = "";
  // window.location.reload();
  return false;
};

socket.on("messages", (data) => {
  if (data) {
    render(data);
  }
});

function render(data) {
  const html = data
    .map((elem, index) => {
      if (elem.type === "usuario") {
        return `<div style="text-align: left;" >
              <span class="text-primary"><strong>${elem.email}</strong></span> <span style="color: brown;">${elem.date}</span>:
              <em>${elem.body}</em></div>`;
      } else {
        return `<div style="text-align: right;" >
              <span class="text-primary"><strong>${elem.email}</strong></span> <span style="color: brown;">${elem.date}</span>:
              <em>${elem.body}</em></div>`;
      }
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
}

function addMessage(e) {
  const mensaje = {
    email: document.getElementById("userEmail").value,
    body: document.getElementById("texto").value,
    type: "usuario",
    date: new Date(),
  };
  socket.emit("new-message", mensaje);

  document.getElementById("texto").value = "";
  document.getElementById("texto").focus();

  return false;
}
