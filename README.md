# Prime Snack

**Alumno:** José Eduardo Miranda Valderrama

Proyecto desarrollado para la materia Aplicaciones Web 1 de la carrera Analista en Sistemas del IES 21.

Prime Snacks es un prototipo de tienda de barritas y snacks de proteína vegetal de Córdoba.

## Prueba local

Desde la raíz del repositorio, ejecutá `node servidor.mjs` con Node.js 24 y abrí [la tienda local](http://127.0.0.1:8765/). El ingreso y la confirmación de pedidos son de demostración.

Para probar Checkout Pro, copiá `.env.example` a un archivo privado fuera del repositorio, completá `MERCADO_PAGO_TEST_ACCESS_TOKEN` con el Access Token del entorno **Prueba** y ejecutá `node "--env-file=RUTA_DEL_ARCHIVO" servidor.mjs`. El ejemplo usa el puerto 8766. En el carrito, elegí **Mercado Pago (prueba)** y usá los medios de pago de prueba de Mercado Pago.

En Vercel, la misma ruta `/api/checkout` se ejecuta como función de servidor. Para activar el checkout, configurá `MERCADO_PAGO_TEST_ACCESS_TOKEN` como variable sensible del proyecto y volvé a desplegar.

## Entrega final

La [plantilla de entrega final](./ENTREGA-FINAL.md) reúne el roadmap, las tecnologías, la mejora principal y los espacios para los enlaces al sitio publicado y al video explicativo.
