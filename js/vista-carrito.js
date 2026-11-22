const estadoCarrito = document.querySelector("#estado-carrito");
const listaCarrito = document.querySelector("#items-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const botonConfirmarPedido = document.querySelector("#confirmar-pedido");
const botonPagarPedido = document.querySelector("#pagar-pedido");
const estadoPago = document.querySelector("#estado-pago");
const resumenPedido = document.querySelector("#resumen-pedido");
let preparandoPago = false;

function crearItemCarrito(item, producto, productos) {
    const fila = document.createElement("li");
    fila.className = "panel item-carrito";
    fila.innerHTML = `
        <div class="item-carrito-info">
            <img alt="" width="80" height="80">
            <div>
                <h2></h2>
                <p class="item-carrito-precio"></p>
            </div>
        </div>
        <div class="item-carrito-acciones">
            <div class="cantidad" role="group">
                <button class="cantidad-menos" type="button">−</button>
                <output></output>
                <button class="cantidad-mas" type="button">+</button>
            </div>
            <p class="item-carrito-subtotal"></p>
            <button class="boton-quitar" type="button">Eliminar</button>
        </div>
    `;

    const titulo = producto ? producto.titulo : "Producto no disponible";
    const imagen = fila.querySelector("img");
    if (producto) {
        imagen.src = raizTienda + "img/" + producto.imagen;
    } else {
        imagen.hidden = true;
    }
    fila.querySelector("h2").textContent = titulo;
    fila.querySelector(".item-carrito-precio").textContent = producto
        ? formatoPrecio.format(producto.precio) + " por unidad · Máximo " + producto.stock + " por pedido"
        : "Sin precio disponible";
    fila.querySelector(".cantidad").setAttribute("aria-label", "Cantidad de " + titulo);
    fila.querySelector("output").textContent = item.cantidad === 1 ? "1 unidad" : item.cantidad + " unidades";
    fila.querySelector(".item-carrito-subtotal").textContent = producto
        ? "Subtotal " + formatoPrecio.format(producto.precio * item.cantidad)
        : "";

    function actualizarItem(operacion, selector) {
        const indice = Array.from(listaCarrito.children).indexOf(fila);
        try {
            const resultado = operacion(item.id);
            mostrarCarrito(productos);
            const siguienteFila = listaCarrito.children[indice] || listaCarrito.lastElementChild;
            let siguiente = siguienteFila ? siguienteFila.querySelector(selector) : document.querySelector("#volver-tienda");
            if (siguiente.disabled) {
                siguiente = siguienteFila.querySelector(".cantidad-menos");
            }
            siguiente.focus();
            if (resultado === null) {
                estadoCarrito.textContent = "El producto ya alcanzó el máximo por pedido.";
            }
        } catch (error) {
            estadoCarrito.textContent = "No se pudo actualizar el carrito.";
        }
    }

    const menos = fila.querySelector(".cantidad-menos");
    menos.setAttribute("aria-label", "Quitar una unidad de " + titulo);
    menos.addEventListener("click", function () {
        actualizarItem(disminuirDelCarrito, ".cantidad-menos");
    });

    const mas = fila.querySelector(".cantidad-mas");
    mas.setAttribute("aria-label", "Añadir una unidad de " + titulo);
    mas.disabled = !producto || item.cantidad >= producto.stock;
    mas.addEventListener("click", function () {
        actualizarItem(function () {
            return agregarAlCarrito(producto, 1);
        }, ".cantidad-mas");
    });

    const eliminar = fila.querySelector(".boton-quitar");
    eliminar.setAttribute("aria-label", "Eliminar " + titulo + " del carrito");
    eliminar.addEventListener("click", function () {
        actualizarItem(eliminarDelCarrito, ".boton-quitar");
    });
    return fila;
}

function mostrarCarrito(productos) {
    const estado = leerEstadoCarrito();
    const items = estado.items;
    listaCarrito.textContent = "";
    totalCarrito.hidden = items.length === 0;
    botonConfirmarPedido.hidden = items.length === 0;
    botonPagarPedido.hidden = items.length === 0;
    estadoCarrito.textContent = items.length === 0 ? "Tu carrito está vacío." : "";

    let total = 0;
    let cantidadesValidas = true;
    for (const item of items) {
        const producto = productos.find(function (entrada) {
            return entrada.id === item.id;
        });
        listaCarrito.appendChild(crearItemCarrito(item, producto, productos));
        if (producto) {
            total += producto.precio * item.cantidad;
        }
        if (!producto || item.cantidad > producto.stock) {
            cantidadesValidas = false;
        }
    }
    botonConfirmarPedido.disabled = !cantidadesValidas;
    botonPagarPedido.disabled = !cantidadesValidas || preparandoPago;
    if (!cantidadesValidas) {
        estadoCarrito.textContent = "Ajustá las cantidades o quitá los productos sin disponibilidad antes de confirmar.";
    }
    totalCarrito.querySelector(".precio").textContent = formatoPrecio.format(total);
    mostrarResumenPedido(estado.ultimoPedido);
}

function mostrarResumenPedido(pedido) {
    resumenPedido.hidden = !pedido;
    if (!pedido) {
        return;
    }

    resumenPedido.querySelector("#numero-pedido").textContent = pedido.numero;
    resumenPedido.querySelector("#total-pedido").textContent = formatoPrecio.format(pedido.total);
    const detalle = resumenPedido.querySelector("#detalle-pedido");
    detalle.textContent = "";
    for (const item of pedido.items) {
        const fila = document.createElement("li");
        fila.textContent = item.cantidad + " × " + item.titulo + " · " + formatoPrecio.format(item.subtotal);
        detalle.appendChild(fila);
    }
}

async function iniciarCarrito() {
    try {
        const productos = await obtenerCatalogo();
        mostrarCarrito(productos);
        botonPagarPedido.addEventListener("click", async function () {
            preparandoPago = true;
            botonPagarPedido.disabled = true;
            estadoPago.textContent = "Preparando el checkout de prueba…";

            try {
                const items = leerCarrito();
                const checkoutUrl = await crearCheckout(items);
                if (JSON.stringify(items) !== JSON.stringify(leerCarrito())) {
                    estadoPago.textContent = "El carrito cambió. Revisalo antes de volver a iniciar el pago.";
                    return;
                }
                estadoPago.textContent = "Abriendo el checkout de prueba…";
                window.location.assign(checkoutUrl);
            } catch (error) {
                estadoPago.textContent = error.message || "No se pudo iniciar el pago de prueba.";
            } finally {
                preparandoPago = false;
                mostrarCarrito(productos);
            }
        });
        botonConfirmarPedido.addEventListener("click", function () {
            try {
                const pedido = confirmarPedido(productos);
                mostrarCarrito(productos);
                if (pedido) {
                    estadoPago.textContent = "";
                    resumenPedido.querySelector("#titulo-pedido").focus();
                }
            } catch (error) {
                estadoCarrito.textContent = "No se pudo guardar el pedido. El carrito sigue disponible.";
            }
        });
    } catch (error) {
        estadoCarrito.textContent = window.location.protocol === "file:"
            ? "Abrí la tienda con un servidor local para cargar el carrito."
            : "No se pudo cargar el carrito. Volvé a intentar recargando la página.";
    }
}

if (usuarioActual) {
    iniciarCarrito();
}
