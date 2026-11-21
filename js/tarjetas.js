function crearTarjeta(producto, raiz, esPortada) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto";
    tarjeta.id = producto.id;
    tarjeta.innerHTML = `
        <img loading="lazy">
        <div class="producto-cuerpo">
            <p class="producto-dato"></p>
            <h3></h3>
            <p class="producto-descripcion"></p>
            <div class="producto-pie">
                <strong class="precio"></strong>
                <div class="cantidad" role="group">
                    <button class="cantidad-menos" type="button" disabled>−</button>
                    <output>1</output>
                    <button class="cantidad-mas" type="button">+</button>
                </div>
            </div>
            <a class="producto-enlace"></a>
        </div>
    `;

    const imagen = tarjeta.querySelector("img");
    imagen.src = raiz + "img/" + producto.imagen;
    imagen.alt = producto.textoAlternativo;
    tarjeta.querySelector(".producto-dato").textContent = producto.etiqueta;
    tarjeta.querySelector("h3").textContent = producto.titulo;
    tarjeta.querySelector(".producto-descripcion").textContent = producto.descripcion;
    tarjeta.querySelector(".precio").textContent = producto.precio;

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
    let cantidad = 1;

    selector.setAttribute("aria-label", "Cantidad de " + producto.titulo);
    menos.setAttribute("aria-label", "Disminuir cantidad de " + producto.titulo);
    mas.setAttribute("aria-label", "Aumentar cantidad de " + producto.titulo);

    function actualizarCantidad(cambio) {
        cantidad = Math.max(1, cantidad + cambio);
        valor.textContent = cantidad;
        menos.disabled = cantidad === 1;
    }

    menos.addEventListener("click", function () {
        actualizarCantidad(-1);
    });
    mas.addEventListener("click", function () {
        actualizarCantidad(1);
    });

    return tarjeta;
}

function mostrarProductos(grilla, raiz) {
    const catalogo = grilla.dataset.catalogo;
    const esPortada = catalogo === "destacados";

    for (const producto of productos) {
        const mostrar = esPortada ? producto.destacado : producto.categoria === catalogo;
        if (mostrar) {
            grilla.appendChild(crearTarjeta(producto, raiz, esPortada));
        }
    }
}

mostrarProductos(document.querySelector(".grilla-productos"), document.body.dataset.raiz);
