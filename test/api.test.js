import supertest from "supertest";
import chai from "chai";
import { getProduct } from "./generador/productos.js";

const request = supertest("http://localhost:8080");
const expect = chai.expect;

const PRODUCT_ID_GET = "60c13ee89fc20bce240eefd3";

describe("test api rest", () => {
  describe("GET", () => {
    it("return 404 code when route not exist", async () => {
      let response = await request.get("/api/test-fail");
      // console.log(response);
      expect(response.status).to.eql(404);
    });

    it("return 200 code when call /productos", async () => {
      let response = await request.get("/api/productos");

      expect(response.status).to.eql(200);
    });

    it("return 404 code when call /productos/:id and id not exists", async () => {
      let response = await request.get("/api/productos/1");

      expect(response.status).to.eql(404);
    });

    it("return 200 code when call /productos/:id and id exists", async () => {
      const product = getProduct();
      console.log(product);
      let response = await request.get(`/api/productos/${PRODUCT_ID_GET}`);

      expect(response.status).to.eql(200);
    });
  });

  describe("PUT", () => {
    it("return 404 code when id not exist", async () => {
      let response = await request.put("/api/productos/1");
      // console.log(response);
      expect(response.status).to.eql(404);
    });

    it("return 200 code when call /productos", async () => {
      const producto = {
        title: 'test',
        price: 234.56,
        thumbnail: 'AAA'
      }
      let response = await request.put(`/api/productos/${PRODUCT_ID_GET}`).send(producto);
      // console.log(response);
      expect(response.status).to.eql(200);
    });
  });
});
