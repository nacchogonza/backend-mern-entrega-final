const cotizacionDolarHoy = 157

const productoConInfo = (producto, id) => {
    return {
        id: id,
        fyh: new Date().toLocaleString(),
        title: producto.title,
        price: producto.price,
        thumbnail: producto.thumbnail
    }
}

export default {
    productoConInfo
}