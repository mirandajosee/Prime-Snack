const sedeIES = { latitud: -31.4227003, longitud: -64.1842942 };
const botonDistancia = document.querySelector("#calcular-distancia");
const estadoDistancia = document.querySelector("#estado-distancia");

function radianes(grados) {
    return grados * Math.PI / 180;
}

function distanciaEnKilometros(latitud, longitud) {
    const diferenciaLatitud = radianes(sedeIES.latitud - latitud);
    const diferenciaLongitud = radianes(sedeIES.longitud - longitud);
    // Fórmula de Haversine para estimar la distancia en línea recta.
    const a = Math.sin(diferenciaLatitud / 2) ** 2
        + Math.cos(radianes(latitud)) * Math.cos(radianes(sedeIES.latitud))
        * Math.sin(diferenciaLongitud / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
}

botonDistancia.addEventListener("click", function () {
    if (!navigator.geolocation) {
        estadoDistancia.textContent = "La ubicación no está disponible en este navegador. Podés usar Cómo llegar.";
        return;
    }
    botonDistancia.disabled = true;
    estadoDistancia.textContent = "Calculando distancia…";

    navigator.geolocation.getCurrentPosition(function (posicion) {
        const distancia = distanciaEnKilometros(posicion.coords.latitude, posicion.coords.longitude);
        const aproximacion = distancia < 1
            ? Math.round(distancia * 1000) + " m"
            : new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(distancia) + " km";
        estadoDistancia.textContent = "Distancia aproximada en línea recta: " + aproximacion + ".";
        botonDistancia.disabled = false;
    }, function () {
        estadoDistancia.textContent = "No pudimos obtener tu ubicación. Podés usar Cómo llegar.";
        botonDistancia.disabled = false;
    }, { timeout: 10000, maximumAge: 60000 });
});
