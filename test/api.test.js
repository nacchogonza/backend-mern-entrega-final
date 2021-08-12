import supertest from 'supertest';
import chai from 'chai'
import { getProduct } from './generador/productos.js'

const request = supertest('http://localhost:8080')
const expect = chai.expect

describe('test api rest', () => {
  describe('GET', () => {
    it('return 404 code when route not exist', async () => {
      let response = await request.get('/api/test-fail')
      // console.log(response);
      expect(response.status).to.eql(404)
    })

    it('return 200 code when call /productos', async () => {
      const product = getProduct()
      console.log(product)
      let response = await request.get('/api/productos')

      expect(response.status).to.eql(200)
    })
  })
})