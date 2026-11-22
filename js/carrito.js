function claveCarrito() {
    return "prime-snacks-carrito:" + usuarioActual.email;
}

function leerEstadoCarrito() {
    const guardado = localStorage.getItem(claveCarrito());
    let estado;
    try {
        estado = JSON.parse(guardado) || {};
    } catch (error) {
        estado = {};
    }

    // Los carritos de M4 se guardaban directamente como un arreglo.
    const items = Array.isArray(estado) ? estado : estado.items;
    return {
        items: Array.isArray(items) ? items.filter(function (item) {
            return item && typeof item.id === "string" && Number.isSafeInteger(item.cantidad) && item.cantidad > 0;
        }) : [],
        ultimoPedido: estado.ultimoPedido || null
    };
}

function leerCarrito() {
    return leerEstadoCarrito().items;
}

function guardarEstadoCarrito(estado) {
    localStorage.setItem(claveCarrito(), JSON.stringify(estado));
}

function agregarAlCarrito(producto, cantidad) {
    const estado = leerEstadoCarrito();
    const existente = estado.items.find(function (item) {
        return item.id === producto.id;
    });
    const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;

    if (nuevaCantidad > producto.stock) {
        return null;
    }
    if (existente) {
        existente.cantidad = nuevaCantidad;
    } else {
        estado.items.push({ id: producto.id, cantidad: cantidad });
    }
    guardarEstadoCarrito(estado);
    return nuevaCantidad;
}

function eliminarDelCarrito(id) {
    const estado = leerEstadoCarrito();
    estado.items = estado.items.filter(function (item) {
        return item.id !== id;
    });
    guardarEstadoCarrito(estado);
}

function disminuirDelCarrito(id) {
    const estado = leerEstadoCarrito();
    const producto = estado.items.find(function (item) {
        return item.id === id;
    });

    if (producto) {
        producto.cantidad -= 1;
        estado.items = estado.items.filter(function (item) {
            return item.cantidad > 0;
        });
        guardarEstadoCarrito(estado);
    }
}

function confirmarPedido(productos) {
    const estado = leerEstadoCarrito();
    if (estado.items.length === 0) {
        return null;
    }

    const detalle = [];
    let total = 0;
    for (const item of estado.items) {
        const producto = productos.find(function (entrada) {
            return entrada.id === item.id;
        });
        if (!producto || item.cantidad > producto.stock) {
            return null;
        }

        const subtotal = producto.precio * item.cantidad;
        detalle.push({ titulo: producto.titulo, cantidad: item.cantidad, subtotal: subtotal });
        total += subtotal;
    }

    const pedido = { numero: "PS-" + Date.now().toString(36).toUpperCase(), items: detalle, total: total };
    guardarEstadoCarrito({ items: [], ultimoPedido: pedido });
    return pedido;
}
