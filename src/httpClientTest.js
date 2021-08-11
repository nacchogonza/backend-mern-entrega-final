import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

const PRODUCT_ID = '60c13ee89fc20bce240eefd3'
const PRODUCT_ID_PUT = '6113c3a91d199f049a00f59f'
const PRODUCT_ID_DELETE = '6111b652fe120ebe777ed61a'

const getProducts = () => {
  return axios.get(`${BASE_URL}/api/productos`)
}

const getProduct = () => {
  return axios.get(`${BASE_URL}/api/productos/${PRODUCT_ID}`)
}

const postProduct = () => {
  return axios.post(`${BASE_URL}/api/productos`, {
    title: 'Regla Test',
    price: 77.77,
    thumbnail: 'AAA'
  })
}

const putProduct = () => {
  return axios.put(`${BASE_URL}/api/productos/${PRODUCT_ID_PUT}`, {
    title: 'Regla Test2',
    price: 77.88,
    thumbnail: 'A'
  })
}

const deleteProduct = () => {
  return axios.delete(`${BASE_URL}/api/productos/${PRODUCT_ID_DELETE}`)
}

Promise.all([getProducts(), getProduct(), putProduct()])
  .then((results) => {
    console.log('Todas las peticiones se realizaron correctamente!')
    console.log(results[2])
  })
  .catch(error => {
    console.log('Hubo algun problema realizando alguna de las peticiones...')
    console.log('Error: ', error)
  })

