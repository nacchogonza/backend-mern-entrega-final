import express from "express";

import {
  getProductController,
  getProductsController,
  insertProductController,
  putProductController,
  removeProductController,
} from "../controller/controllers.js";

const routerApi = express.Router();
routerApi.use(express.json());
routerApi.use(express.urlencoded({ extended: true }));

routerApi.get("/productos", async (req, res) => {
  const data = await getProductsController();
  if (!data.length) {
    res.status(404).json({ error: "no hay productos cargados" });
    return
  }
  res.status(200).json(data);
});

routerApi.post("/productos", async (req, res) => {
  const data = req.body;
  data.price = parseFloat(data.price);
  const newProduct = await insertProductController({
    title: data.title,
    price: data.price,
    thumbnail: data.thumbnail,
  });
  if (!newProduct) {
    res.status(500).json({ error: "no se pudo agregar el producto" });
    return
  }
  res.status(200).json(newProduct);
});

routerApi.get("/productos/:id", async (req, res) => {
  const filterProduct = await getProductController(req.params.id);
  if (!filterProduct) {
    res.status(404).json({ error: "producto no encontrado" });
    return
  }
  res.status(200).json(filterProduct);
});

routerApi.put("/productos/:id", async (req, res) => {
  const data = req.body;
  console.log(data)
  data.price = parseFloat(data.price);
  const updateProduct = await putProductController(
    {
      title: data.title,
      price: data.price,
      thumbnail: data.thumbnail,
    },
    req.params.id
  );
  if (!updateProduct) {
    res.status(404).json({ error: "producto no encontrado" });
    return;
  }
  res.status(200).json(updateProduct);
});

routerApi.delete("/productos/:id", async (req, res) => {
  const deleteProduct = await removeProductController(req.params.id);
  if (!deleteProduct) {
    res.status(404).json({ error: "producto no encontrado" });
    return;
  }
  res.status(200).json(deleteProduct);
});

export { routerApi };
