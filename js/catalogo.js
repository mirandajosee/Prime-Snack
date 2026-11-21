async function obtenerCatalogo() {
    const respuesta = await fetch(raizTienda + "datos/productos.json");
    if (!respuesta.ok) {
        throw new Error("El catálogo no está disponible.");
    }
    const productos = await respuesta.json();
    if (!Array.isArray(productos)) {
        throw new Error("El catálogo no tiene un formato válido.");
    }
    return productos;
}

const formatoPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});
