import Config from '../config.js'
import mongoose from 'mongoose';
import DbClient from './DbClient.js'

class MyMongoClient extends DbClient {
    constructor() {
        super()
        this.connected = false
        this.client = mongoose
    }

    async connect() {
        try {
            await this.client.connect(Config.db.cnxStr, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            this.connected = true;
            console.log('base de datos conectada')
        } catch (error) {
            throw new Error(error)
        }
    }

    async disconnect() {
        try {
            await this.client.connection.close()
            console.log('base de datos desconectada')
            this.connected = false
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default MyMongoClient