import Joi from 'joi'

class Productos {

    constructor(title, price, thumbnail) {
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
    }

    static validar(noticia,requerido) {
        const ProductoSchema = Joi.object({
            title: requerido? Joi.string().required() : Joi.string(),
            price: requerido? Joi.number().required() : Joi.number(),
            thumbnail: requerido? Joi.string().required() : Joi.string(),
        })

        const { error } = ProductoSchema.validate(noticia)
        if (error) {
            throw error
        }
    }
}

export default Productos