import mongoose from "mongoose";

const mensajesSchema = new mongoose.Schema({
  author: {
    email: {
      type: String,
      require: true,
      max: 100,
    },
    nombre: {
      type: String,
      require: true,
      max: 100,
    },
    apellido: {
      type: String,
      require: true,
      max: 100,
    },
    edad: {
      type: String,
      require: true,
      max: 100,
    },
    alias: {
      type: String,
      require: true,
      max: 100,
    },
    avatar: {
      type: String,
      require: true,
      max: 100,
    },
  },
  text: {
    type: String,
    require: true,
    max: 255,
  },
  date: {
    type: String,
    require: true,
    max: 100,
  },
});

export { mensajesSchema };
