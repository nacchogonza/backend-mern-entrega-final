import ProductosDao from './ProductosDAO.js'

class ProductosDaoMem extends ProductosDao {

    constructor() {
        super()
        this.productos = [];
        this.mensajes = []
    }

    async getAll() {
        try {
            const buscados = this.productos;
            return buscados
        } catch (err) {
            throw new Error(err)
        }
    }

    async getById(idBuscado) {
        let buscado
        try {
            buscado = this.productos.find(product => product.id == idBuscado)
        } catch (err) {
            throw new Error(err)
        }

        if (!buscado) {
            throw new Error(err)
        }

        return buscado
    }

    async add(prodNuevo) {
        try {
            this.productos.push(prodNuevo)
        } catch (error) {
            throw new Error(err)
        }
        return prodNuevo
    }

    async deleteById(idParaBorrar) {
        let result
        try {
            result = this.productos.find(product => product.id == idParaBorrar)
        } catch (error) {
            throw new Error(err)
        }

        if (!result) {
            throw new Error(err)
        }

        const newProductsArray = this.productos.filter(product => product.id != idParaBorrar);
        this.productos = newProductsArray;
        return result;
    }

    async deleteAll() {
        try {
            this.productos = []
        } catch (error) {
            throw new Error(err)
        }
    }

    async updateById(idParaReemplazar, nuevoProd) {
        let result
        try {
            result = this.productos.find(product => product.id == idParaReemplazar)
        } catch (error) {
            throw new Error(err)
        }

        if (!result) {
            throw new Error(err)
        }

        result.title = nuevoProd.title;
        result.price = nuevoProd.price;
        result.thumbnail = nuevoProd.thumbnail;

        return nuevoProd
    }

    exit() {
        this.client.disconnect()
    }
}

export default ProductosDaoMem