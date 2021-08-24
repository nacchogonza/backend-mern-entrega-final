import mongoose from "mongoose";
import Config from '../persistence/config.js'

const productosSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    max: 100,
  },
  price: {
    type: Number,
    require: true,
  },
  thumbnail: {
    type: String,
    require: true,
    max: 255,
  },
});

const ProductoModel = mongoose.model(Config.db.collectionProductos,productosSchema)

export { ProductoModel, productosSchema };
