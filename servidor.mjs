import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { iniciarCheckout } from "./api/checkout.mjs";

const host = "127.0.0.1";
const puerto = Number(process.env.PORT || 8765);
const origen = "http://" + host + ":" + puerto;
const raiz = new URL("./", import.meta.url);
const tipos = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webp": "image/webp",
    ".png": "image/png"
};

function responderJSON(respuesta, estado, datos) {
    respuesta.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(datos));
}

const servidor = createServer(async (solicitud, respuesta) => {
    respuesta.setHeader("Cache-Control", "no-store");
    respuesta.setHeader("X-Content-Type-Options", "nosniff");
    try {
        if (solicitud.headers.host !== host + ":" + puerto) {
            return responderJSON(respuesta, 403, { error: "Usá la dirección local indicada al iniciar el servidor." });
        }
        const ruta = new URL(solicitud.url, origen).pathname;
        if (ruta === "/api/checkout") {
            return await iniciarCheckout(solicitud, respuesta, origen);
        }

        const archivo = ruta === "/" ? "/index.html" : ruta;
        const publico = /^\/(index\.html|pages\/[a-z0-9-]+\.html|styles\/[a-z0-9-]+\.css|js\/[a-z0-9-]+\.js|datos\/[a-z0-9-]+\.json|img\/[a-z0-9-]+\.(webp|png))$/i;
        if (!publico.test(archivo) || !["GET", "HEAD"].includes(solicitud.method)) {
            respuesta.writeHead(404).end();
            return;
        }
        const contenido = await readFile(new URL(archivo.slice(1), raiz));
        respuesta.writeHead(200, { "Content-Type": tipos[extname(archivo).toLowerCase()] });
        respuesta.end(solicitud.method === "HEAD" ? undefined : contenido);
    } catch (error) {
        responderJSON(respuesta, error.code === "ENOENT" ? 404 : 500, { error: "No se pudo completar la solicitud." });
    }
});

servidor.listen(puerto, host, function () {
    console.log("Prime Snacks disponible en " + origen);
});
