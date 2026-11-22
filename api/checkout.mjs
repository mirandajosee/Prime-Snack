import { readFile } from "node:fs/promises";
import { join } from "node:path";

const endpoint = "https://api.mercadopago.com/v1/orders";

function responderJSON(respuesta, estado, datos) {
    respuesta.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(datos));
}

async function leerSolicitud(solicitud) {
    if (solicitud.body && typeof solicitud.body === "object") {
        return solicitud.body;
    }
    const partes = [];
    let bytes = 0;
    for await (const parte of solicitud.iterator({ destroyOnReturn: false })) {
        bytes += parte.length;
        if (bytes > 8192) {
            return null;
        }
        partes.push(parte);
    }
    try {
        return JSON.parse(Buffer.concat(partes).toString("utf8"));
    } catch {
        return null;
    }
}

function prepararOrden(items, productos, intento) {
    if (!Array.isArray(items) || items.length === 0 || items.length > productos.length) {
        return null;
    }

    const ids = new Set();
    const detalle = [];
    let total = 0;
    for (const item of items) {
        const producto = productos.find(entrada => entrada.id === item?.id);
        if (!producto || ids.has(item.id) || !Number.isSafeInteger(item.cantidad)
                || item.cantidad < 1 || item.cantidad > producto.stock) {
            return null;
        }
        ids.add(item.id);
        total += producto.precio * item.cantidad;
        detalle.push({
            title: producto.titulo,
            quantity: item.cantidad,
            unit_price: producto.precio.toFixed(2)
        });
    }
    return {
        type: "online",
        processing_mode: "manual",
        total_amount: total.toFixed(2),
        external_reference: "prime-snacks-" + intento,
        items: detalle
    };
}

export async function iniciarCheckout(solicitud, respuesta, origen) {
    const token = process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN?.trim();
    respuesta.setHeader("Cache-Control", "no-store");
    if (solicitud.method !== "POST") {
        respuesta.setHeader("Allow", "POST");
        return responderJSON(respuesta, 405, { error: "Usá POST para iniciar el checkout." });
    }
    if (solicitud.headers.origin !== origen) {
        return responderJSON(respuesta, 403, { error: "Iniciá el checkout desde la vista local de la tienda." });
    }
    if (solicitud.headers["content-type"]?.split(";")[0] !== "application/json") {
        return responderJSON(respuesta, 415, { error: "El carrito debe enviarse como JSON." });
    }
    if (!token) {
        const error = process.env.VERCEL
            ? "El checkout de prueba requiere configurar su Access Token en Vercel y volver a desplegar."
            : "Configurá el Access Token de prueba y reiniciá el servidor.";
        return responderJSON(respuesta, 503, { error: error });
    }

    const datos = await leerSolicitud(solicitud);
    const intento = datos?.intento;
    if (typeof intento !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(intento)) {
        return responderJSON(respuesta, 400, { error: "El intento de pago no es válido." });
    }

    const productos = JSON.parse(await readFile(join(process.cwd(), "datos", "productos.json"), "utf8"));
    const orden = prepararOrden(datos.items, productos, intento);
    if (!orden) {
        return responderJSON(respuesta, 400, { error: "Revisá los productos y las cantidades antes de pagar." });
    }

    try {
        const resultado = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                "X-Idempotency-Key": intento
            },
            body: JSON.stringify(orden),
            redirect: "error",
            signal: AbortSignal.timeout(15000)
        });
        if (!resultado.ok) {
            return responderJSON(respuesta, 502, { error: "Mercado Pago rechazó la solicitud de prueba (HTTP " + resultado.status + ")." });
        }

        const pago = await resultado.json();
        const destino = new URL(pago.checkout_url);
        // La API emite identificadores ORDTST para las órdenes de prueba.
        if (!/^ORDTST[A-Z0-9]+$/.test(pago.id) || destino.protocol !== "https:"
                || !["www.mercadopago.com.ar", "www.mercadopago.com"].includes(destino.host)) {
            return responderJSON(respuesta, 502, { error: "La respuesta no corresponde a un checkout de prueba válido." });
        }
        return responderJSON(respuesta, 201, { id: pago.id, checkoutUrl: destino.href });
    } catch {
        return responderJSON(respuesta, 502, { error: "No se pudo abrir Mercado Pago. Volvé a intentar." });
    }
}

export default async function checkout(solicitud, respuesta) {
    try {
        await iniciarCheckout(solicitud, respuesta, "https://" + solicitud.headers.host);
    } catch {
        responderJSON(respuesta, 500, { error: "No se pudo completar la solicitud." });
    }
}
