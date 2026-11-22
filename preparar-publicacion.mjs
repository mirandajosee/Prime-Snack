import { cp, mkdir } from "node:fs/promises";

await mkdir("public", { recursive: true });
for (const archivo of ["index.html", "pages", "styles", "js", "datos", "img"]) {
    await cp(archivo, "public/" + archivo, { recursive: true });
}
