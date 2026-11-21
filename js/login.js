const formularioLogin = document.querySelector("#formulario-login");

formularioLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const email = formularioLogin.querySelector("#email").value.trim().toLowerCase();

    try {
        sessionStorage.setItem(claveSesion, JSON.stringify({ email: email }));
        window.location.replace(formularioLogin.action);
    } catch (error) {
        document.querySelector("#estado-login").textContent = "No se pudo guardar la sesión en este navegador.";
    }
});
