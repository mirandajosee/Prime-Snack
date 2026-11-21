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

    if (paginaActual === "login" || paginaActual === "registro") {
        const enlace = document.createElement("a");
        enlace.className = "nav-cuenta";
        enlace.href = rutaLogin;
        enlace.textContent = "Iniciar sesión";
        if (paginaActual === "login") {
            enlace.setAttribute("aria-current", "page");
        }
        contenedor.appendChild(enlace);
    } else {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "nav-cuenta";
        boton.textContent = "Cerrar sesión";
        boton.addEventListener("click", function () {
            window.location.href = rutaLogin;
        });
        contenedor.appendChild(boton);
    }
}

crearNavbar(document.querySelector("#navbar"), document.body.dataset.raiz);
