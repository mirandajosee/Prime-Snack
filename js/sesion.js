const claveSesion = "prime-snacks-usuario";
const raizTienda = document.body.dataset.raiz;

function leerUsuario() {
    try {
        const usuario = JSON.parse(sessionStorage.getItem(claveSesion));
        if (usuario && typeof usuario.email === "string" && usuario.email) {
            return usuario;
        }
    } catch (error) {
        return null;
    }
    return null;
}

const usuarioActual = leerUsuario();
const requiereSesion = document.body.hasAttribute("data-requiere-sesion");

if (requiereSesion) {
    if (usuarioActual) {
        document.querySelector("main").hidden = false;
    } else {
        window.location.replace(raizTienda + "pages/login.html");
    }

    window.addEventListener("pageshow", function (evento) {
        if (evento.persisted) {
            window.location.reload();
        }
    });
}
