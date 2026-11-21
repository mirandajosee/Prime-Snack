const formularioLogin = document.querySelector("#formulario-login");

formularioLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    // El navegador ya validó los campos. Este ingreso es de demostración.
    window.location.href = formularioLogin.action;
});
