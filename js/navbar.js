const paginasTienda = [
    { id: "inicio", titulo: "Inicio", ruta: "index.html" },
    { id: "barritas", titulo: "Barritas", ruta: "pages/barritas.html" },
    { id: "snacks", titulo: "Otros snacks", ruta: "pages/snacks.html" },
    { id: "contacto", titulo: "Contacto", ruta: "pages/contacto.html" }
];

function crearNavbar(contenedor, raiz) {
    const paginaActual = contenedor.dataset.pagina;
    const rutaLogin = raiz + "pages/login.html";

    contenedor.innerHTML = `
        <a class="marca">
            <img alt="" width="38" height="38">
            Prime Snacks
        </a>
        <ul class="nav-enlaces"></ul>
    `;

    const marca = contenedor.querySelector(".marca");
    marca.href = raiz + "index.html";
    marca.querySelector("img").src = raiz + "img/prime-snacks.webp";

    const lista = contenedor.querySelector(".nav-enlaces");
    for (const pagina of paginasTienda) {
        const elemento = document.createElement("li");
        const enlace = document.createElement("a");
        enlace.href = raiz + pagina.ruta;
        enlace.textContent = pagina.titulo;

        if (pagina.id === paginaActual) {
            enlace.setAttribute("aria-current", "page");
        }

        elemento.appendChild(enlace);
        lista.appendChild(elemento);
    }

    if (!usuarioActual) {
        const enlace = document.createElement("a");
        enlace.className = "nav-cuenta";
        enlace.href = rutaLogin;
        enlace.textContent = "Iniciar sesión";
        if (paginaActual === "login") {
            enlace.setAttribute("aria-current", "page");
        }
        contenedor.appendChild(enlace);
    } else {
        const acciones = document.createElement("div");
        acciones.className = "nav-acciones";

        const carrito = document.createElement("a");
        carrito.className = "nav-carrito";
        carrito.href = raiz + "pages/carrito.html";
        carrito.title = "Carrito";
        carrito.setAttribute("aria-label", "Carrito");
        carrito.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2 3h3l3 12h11l3-9H6"></path>
                <circle cx="9" cy="20" r="1"></circle>
                <circle cx="18" cy="20" r="1"></circle>
            </svg>
        `;
        if (paginaActual === "carrito") {
            carrito.setAttribute("aria-current", "page");
        }

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "nav-cuenta";
        boton.textContent = "Cerrar sesión";
        boton.addEventListener("click", function () {
            sessionStorage.removeItem(claveSesion);
            window.location.replace(rutaLogin);
        });
        acciones.appendChild(carrito);
        acciones.appendChild(boton);
        contenedor.appendChild(acciones);
    }
}

if (!requiereSesion || usuarioActual) {
    crearNavbar(document.querySelector("#navbar"), raizTienda);
}
