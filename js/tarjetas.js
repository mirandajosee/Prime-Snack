function crearTarjeta(producto, raiz, esPortada, enCarrito) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto";
    tarjeta.id = producto.id;
    const nivelTitulo = esPortada ? "h4" : "h3";
    tarjeta.innerHTML = `
        <img loading="lazy">
        <div class="producto-cuerpo">
            <p class="producto-dato"></p>
            <${nivelTitulo} class="producto-titulo"></${nivelTitulo}>
            <p class="producto-descripcion"></p>
            <div class="producto-pie">
                <strong class="precio"></strong>
                <div class="cantidad" role="group">
                    <button class="cantidad-menos" type="button" disabled>−</button>
                    <output>0</output>
                    <button class="cantidad-mas" type="button">+</button>
                </div>
            </div>
            <p class="producto-stock"></p>
            <div class="producto-acciones">
                <button class="boton boton-violeta agregar-carrito" type="button" disabled>Añadir al carrito</button>
                <a class="producto-enlace"></a>
            </div>
            <p class="estado-producto" role="status"></p>
        </div>
    `;

    const imagen = tarjeta.querySelector("img");
    imagen.src = raiz + "img/" + producto.imagen;
    imagen.alt = producto.textoAlternativo;
    tarjeta.querySelector(".producto-dato").textContent = producto.etiqueta;
    tarjeta.querySelector(".producto-titulo").textContent = producto.titulo;
    tarjeta.querySelector(".producto-descripcion").textContent = producto.descripcion;
    tarjeta.querySelector(".precio").textContent = formatoPrecio.format(producto.precio);

    const enlace = tarjeta.querySelector(".producto-enlace");
    if (esPortada) {
        enlace.href = raiz + "pages/" + producto.categoria + ".html#" + producto.id;
        enlace.textContent = "Ver producto →";
        enlace.setAttribute("aria-label", "Ver producto: " + producto.titulo);
    } else {
        enlace.href = raiz + "pages/contacto.html";
        enlace.textContent = "Consultar →";
        enlace.setAttribute("aria-label", "Consultar por " + producto.titulo);
    }

    const selector = tarjeta.querySelector(".cantidad");
    const menos = selector.querySelector(".cantidad-menos");
    const mas = selector.querySelector(".cantidad-mas");
    const valor = selector.querySelector("output");
    const agregar = tarjeta.querySelector(".agregar-carrito");
    const estado = tarjeta.querySelector(".estado-producto");
    const stock = tarjeta.querySelector(".producto-stock");
    let cantidad = 0;

    selector.setAttribute("aria-label", "Cantidad de " + producto.titulo);
    menos.setAttribute("aria-label", "Disminuir cantidad de " + producto.titulo);
    mas.setAttribute("aria-label", "Aumentar cantidad de " + producto.titulo);
    agregar.setAttribute("aria-label", "Añadir al carrito: " + producto.titulo);

    function actualizarCantidad(cambio) {
        const disponibles = Math.max(0, producto.stock - enCarrito);
        cantidad = Math.max(0, Math.min(disponibles, cantidad + cambio));
        valor.textContent = cantidad;
        menos.disabled = cantidad === 0;
        mas.disabled = cantidad >= disponibles;
        agregar.disabled = cantidad === 0;
        stock.textContent = disponibles === 0
            ? "Máximo por pedido alcanzado."
            : "Hasta " + producto.stock + " por pedido" + (enCarrito ? " · " + enCarrito + " en el carrito" : "");
        estado.textContent = "";
    }

    menos.addEventListener("click", function () {
        actualizarCantidad(-1);
        if (menos.disabled) {
            mas.focus();
        }
    });
    mas.addEventListener("click", function () {
        actualizarCantidad(1);
        if (mas.disabled) {
            agregar.focus();
        }
    });
    agregar.addEventListener("click", function () {
        try {
            const nuevaCantidad = agregarAlCarrito(producto, cantidad);
            if (nuevaCantidad === null) {
                const item = leerCarrito().find(function (entrada) {
                    return entrada.id === producto.id;
                });
                enCarrito = item ? item.cantidad : 0;
                actualizarCantidad(0);
                estado.textContent = "La cantidad supera el máximo disponible para este pedido.";
                (mas.disabled ? enlace : mas).focus();
                return;
            }
            const mensaje = cantidad === 1 ? "1 unidad añadida al carrito." : cantidad + " unidades añadidas al carrito.";
            enCarrito = nuevaCantidad;
            actualizarCantidad(-cantidad);
            estado.textContent = mensaje;
            (mas.disabled ? enlace : mas).focus();
        } catch (error) {
            estado.textContent = "No se pudo guardar el producto en el carrito.";
        }
    });

    actualizarCantidad(0);
    return tarjeta;
}

async function mostrarProductos() {
    const grillas = document.querySelectorAll(".grilla-productos");
    const estado = document.querySelector("#estado-catalogo");

    try {
        const productos = await obtenerCatalogo();
        const esPortada = document.querySelector("#navbar").dataset.pagina === "inicio";
        const items = leerCarrito();

        for (const grilla of grillas) {
            const categoria = grilla.dataset.catalogo;
            const seleccion = productos.filter(function (producto) {
                return producto.categoria === categoria;
            });
            for (const producto of seleccion) {
                const item = items.find(function (entrada) {
                    return entrada.id === producto.id;
                });
                grilla.appendChild(crearTarjeta(producto, raizTienda, esPortada, item ? item.cantidad : 0));
            }
        }
        estado.textContent = "";

        // Las tarjetas se agregan después de la carga inicial del documento.
        const destino = document.getElementById(window.location.hash.slice(1));
        if (destino) {
            destino.scrollIntoView();
        }
    } catch (error) {
        estado.textContent = window.location.protocol === "file:"
            ? "Abrí la tienda con un servidor local para cargar el catálogo."
            : "No se pudo cargar el catálogo. Volvé a intentar recargando la página.";
    }
}

if (usuarioActual) {
    mostrarProductos();
}
