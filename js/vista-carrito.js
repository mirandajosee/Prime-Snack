const estadoCarrito = document.querySelector("#estado-carrito");
const listaCarrito = document.querySelector("#items-carrito");
const totalCarrito = document.querySelector("#total-carrito");

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
        ? formatoPrecio.format(producto.precio) + " por unidad"
        : "Sin precio disponible";
    fila.querySelector(".cantidad").setAttribute("aria-label", "Cantidad de " + titulo);
    fila.querySelector("output").textContent = item.cantidad === 1 ? "1 unidad" : item.cantidad + " unidades";
    fila.querySelector(".item-carrito-subtotal").textContent = producto
        ? "Subtotal " + formatoPrecio.format(producto.precio * item.cantidad)
        : "";

    function actualizarItem(operacion, selector) {
        const indice = Array.from(listaCarrito.children).indexOf(fila);
        try {
            operacion(item.id);
            mostrarCarrito(productos);
            const siguienteFila = listaCarrito.children[indice] || listaCarrito.lastElementChild;
            const siguiente = siguienteFila ? siguienteFila.querySelector(selector) : document.querySelector("#volver-tienda");
            siguiente.focus();
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
    mas.disabled = !producto;
    mas.addEventListener("click", function () {
        actualizarItem(function (id) {
            agregarAlCarrito(id, 1);
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
    const items = leerCarrito();
    listaCarrito.textContent = "";
    totalCarrito.hidden = items.length === 0;
    estadoCarrito.textContent = items.length === 0 ? "Tu carrito está vacío." : "";

    let total = 0;
    for (const item of items) {
        const producto = productos.find(function (entrada) {
            return entrada.id === item.id;
        });
        listaCarrito.appendChild(crearItemCarrito(item, producto, productos));
        if (producto) {
            total += producto.precio * item.cantidad;
        }
    }
    totalCarrito.querySelector(".precio").textContent = formatoPrecio.format(total);
}

async function iniciarCarrito() {
    try {
        const productos = await obtenerCatalogo();
        mostrarCarrito(productos);
    } catch (error) {
        estadoCarrito.textContent = window.location.protocol === "file:"
            ? "Abrí la tienda con un servidor local para cargar el carrito."
            : "No se pudo cargar el carrito. Volvé a intentar recargando la página.";
    }
}

if (usuarioActual) {
    iniciarCarrito();
}
