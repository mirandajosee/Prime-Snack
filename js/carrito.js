function claveCarrito() {
    return "prime-snacks-carrito:" + usuarioActual.email;
}

function leerCarrito() {
    const guardado = localStorage.getItem(claveCarrito());
    try {
        const items = JSON.parse(guardado);
        if (Array.isArray(items)) {
            return items.filter(function (item) {
                return item && typeof item.id === "string" && Number.isSafeInteger(item.cantidad) && item.cantidad > 0;
            });
        }
    } catch (error) {
        return [];
    }
    return [];
}

function guardarCarrito(items) {
    localStorage.setItem(claveCarrito(), JSON.stringify(items));
}

function agregarAlCarrito(id, cantidad) {
    const items = leerCarrito();
    const existente = items.find(function (item) {
        return item.id === id;
    });

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        items.push({ id: id, cantidad: cantidad });
    }
    guardarCarrito(items);
}

function eliminarDelCarrito(id) {
    const restantes = leerCarrito().filter(function (item) {
        return item.id !== id;
    });
    guardarCarrito(restantes);
}

function disminuirDelCarrito(id) {
    const items = leerCarrito();
    const producto = items.find(function (item) {
        return item.id === id;
    });

    if (producto) {
        producto.cantidad -= 1;
        const restantes = items.filter(function (item) {
            return item.cantidad > 0;
        });
        guardarCarrito(restantes);
    }
}
