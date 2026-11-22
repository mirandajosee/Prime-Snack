let intentoCheckout;

async function crearCheckout(items) {
    const detalle = JSON.stringify(items);
    if (!intentoCheckout || intentoCheckout.detalle !== detalle) {
        intentoCheckout = { detalle: detalle, id: crypto.randomUUID() };
    }

    const respuesta = await fetch(raizTienda + "api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items, intento: intentoCheckout.id })
    });
    if (respuesta.status === 404 || respuesta.status === 405 || respuesta.status === 501) {
        throw new Error("Iniciá la tienda con el servidor de Node.js para probar Mercado Pago.");
    }

    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.error);
    }
    return datos.checkoutUrl;
}
