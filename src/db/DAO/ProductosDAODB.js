import ProductosDao from './ProductosDAO.js'
import { ProductoModel } from '../../model/ProductosSchema.js'
import MyMongoClient from '../db/DbClientMongo.js'
import Config from '../config.js'

class ProductosDaoDb extends ProductosDao {

    constructor() {
        super()
        this.client = new MyMongoClient()
        this.client.connect()
        this.projection = Config.db.projection
    }

    async getAll() {
        try {
            const buscados = await ProductoModel.find({}, this.projection).lean()
            return buscados
        } catch (err) {
            throw new Error(err)
        }
    }

    async getById(idBuscado) {
        let buscado
        try {
            buscado = await ProductoModel.findOne({ _id: idBuscado }, this.projection)
        } catch (err) {
            throw new Error(err)
        }

        if (!buscado) {
            throw new Error(err)
        }

        return [buscado]
    }

    async add(prodNuevo) {
        let result
        try {
            const productoAdd = new ProductoModel(prodNuevo)
            result = await productoAdd.save()
        } catch (error) {
            throw new Error(err)
        }
        return prodNuevo
    }

    async deleteById(idParaBorrar) {
        let result
        try {
            result = await ProductoModel.deleteOne({ _id: idParaBorrar })
        } catch (error) {
            throw new Error(err)
        }

        if (result.deletedCount == 0) {
            throw new Error(err)
        }
    }

    async deleteAll() {
        try {
            await ProductoModel.deleteMany()
        } catch (error) {
            throw new Error(err)
        }
    }

    async updateById(idParaReemplazar, nuevoProd) {
        let result
        try {
            result = await ProductoModel.findOneAndReplace({ _id: idParaReemplazar }, nuevoProd, this.projection)
        } catch (error) {
            throw new Error(err)
        }

        if (!result) {
            throw new Error(err)
        }

        return nuevoProd
    }

    exit() {
        this.client.disconnect()
    }
}

export default ProductosDaoDb