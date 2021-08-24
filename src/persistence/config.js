const Config = {
    db: {
        name: 'ecommerce2',
        cnxStr: 'mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce2?retryWrites=true&w=majority',
        collectionProductos: 'productos',
        collectionMensajes: 'mensajes',
        projection: { __v: 0 }
    }
}


export default Config