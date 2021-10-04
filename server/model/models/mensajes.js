import Joi from 'joi'

class Mensajes {

    constructor(email, type, date, body) {
        this.email = email
        this.type = type
        this.date = date
        this.body = body
    }

    static validar(mensaje,requerido) {
        console.log(mensaje)
        const MensajeSchema = Joi.object({
            email: requerido? Joi.string().required() : Joi.string(),
            type: requerido? Joi.string().required() : Joi.number(),
            date: requerido? Joi.string().required() : Joi.string(),
            body: requerido? Joi.string().required() : Joi.string(),
        })

        const { error } = MensajeSchema.validate(mensaje)
        if (error) {
            throw error
        }
    }
}

export default Mensajes