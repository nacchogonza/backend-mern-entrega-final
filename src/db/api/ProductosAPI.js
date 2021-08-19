import ProductosDaoDB from '../DAO/ProductosDAODB.js'
import ProductoDTO from '../dto/ProductoDTO.js'
import ProductosDaoMem from '../DAO/ProductosDAOMem.js';

class ProductosApi {

    constructor(type) {
        switch (type) {
            case 'Mongo': this.productosDao = new ProductosDaoDB()
            case 'Mem': this.productosDao = new ProductosDaoMem()
        }
        this.type = type;
    }

    async agregar(prodParaAgregar) {
        console.log('add api')
        console.log(this.type)
        if (this.type == "Mongo") {
            const prodAgregado = await this.productosDao.add(prodParaAgregar)
            return prodAgregado
        }
        if (this.type == "Mem" || this.type == "FS") {
            console.log('pasando por el if mem')
            const productos = await this.productosDao.getAll()
            const productoDto = ProductoDTO.productoConInfo(prodParaAgregar, productos.length + 1);
            console.log(productoDto)
            const prodAgregado = await this.productosDao.add(productoDto)
            return prodAgregado
        }
    }

    async buscar(id) {
        let productos
        if (id) {
            productos = await this.productosDao.getById(id)
        } else {
            productos = await this.productosDao.getAll()
        }
        return productos
    }

    async borrar(id) {
        if (id) {
            await this.productosDao.deleteById(id)
        }
        else {
            await this.productosDao.deleteAll()
        }
    }

    async reemplazar(id, prodParaReemplazar) {
        const prodReemplazado = await this.productosDao.updateById(id, prodParaReemplazar)
        return prodReemplazado
    }

    exit() {
        this.productosDao.exit()
    }

}

export default ProductosApi