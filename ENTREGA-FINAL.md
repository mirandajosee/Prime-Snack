# Entrega final de Aplicaciones Web 1

**Proyecto** — Prime Snacks  
**Estudiante** — José Eduardo Miranda Valderrama

## Proyecto publicado

- Plataforma de publicación — Vercel
- Enlace público — [Prime Snacks](https://prime-snack.vercel.app/)
- Código fuente — [Repositorio en GitHub](https://github.com/mirandajosee/Prime-Snack)

Para recorrer la tienda, ingresá con un correo válido y una contraseña de prueba. Podés explorar el catálogo, agregar productos, ajustar cantidades y confirmar un pedido de demostración.

## Roadmap de desarrollo

El desarrollo se organizó en cuatro etapas que siguen el orden de los módulos de Aplicaciones Web 1. Las fechas marcadas como orientativas sirven para ubicar las etapas que se extendieron más allá del plazo.

| Etapa | Fecha de referencia | Objetivo | Trabajo realizado | Iteraciones y cambios |
| --- | --- | --- | --- | --- |
| Estructura HTML y formularios | 30/08/2026, 23:59 (plazo cumplido) | Cumplir lo solicitado en el módulo 1 de la materia Aplicaciones Web 1. | Maqueté Inicio, Barritas, Otros snacks y Contacto. Armé los formularios de ingreso y registro con etiquetas, tipos de campo y validación HTML. | El docente aprobó los formularios y señaló un enlace roto. Corregí la ruta del logo de Contacto hacia Inicio y la referencia a su archivo. |
| Identidad visual y diseño adaptable | 24/09/2026 (orientativa) | Cumplir lo solicitado en el módulo 2 de la materia Aplicaciones Web 1. | Definí la paleta, diseñé el navbar y los formularios, y armé una tarjeta de producto y una grilla adaptable con CSS. | Reemplacé el logo, incorporé imágenes WebP y amplié el catálogo. La portada pasó de mostrar una barrita a presentar tres productos destacados. |
| Interactividad con JavaScript | 22/10/2026 (orientativa) | Cumplir lo solicitado en el módulo 3 de la materia Aplicaciones Web 1. | Implementé las redirecciones de ingreso y salida. Generé el navbar y las tarjetas a partir de arreglos de objetos y agregué controles de cantidad por producto. | Reemplacé el HTML repetido de la navegación y del catálogo por componentes reutilizables. Conservé la validación nativa de los formularios y probé los enlaces y controles en escritorio y móvil. |
| Integración y entrega final | 20/11/2026 (plazo previsto) | Cumplir lo solicitado en el módulo 4 de la materia Aplicaciones Web 1. | Cargué el catálogo JSON mediante `fetch`, guardé el correo en `sessionStorage` y construí un carrito por usuario con `localStorage`. Agrupé los cinco productos de Inicio en dos categorías. | Agregué controles para sumar, restar y eliminar productos, un límite de disponibilidad por pedido y un comprobante local. Integré un checkout de prueba con Mercado Pago y añadí el mapa y el cálculo de distancia en Contacto. Publiqué el sitio en Vercel. |

## Tecnologías utilizadas

- **HTML y CSS** para la estructura, los formularios y el diseño adaptable. Flexbox y Grid organizan la navegación y las tarjetas.
- **JavaScript y las API del navegador** para generar componentes y cargar el catálogo JSON con `fetch`. `sessionStorage` guarda el correo de la sesión de demostración por pestaña y `localStorage` conserva el carrito y el último pedido por correo en el mismo navegador.
- **Node.js y Vercel Functions** como tecnologías adicionales. Usé Node.js para servir la tienda en local y ejecutar la lógica de checkout en el servidor. En Vercel, la ruta `/api/checkout` se ejecuta como una función y mantiene el Access Token de prueba en una variable de entorno privada.
- **Mercado Pago Checkout Pro y su API de órdenes** para iniciar un pago de prueba desde el carrito. La función recibe los identificadores y cantidades, calcula el importe con los precios del catálogo y devuelve la URL del checkout. Para habilitar el pago de prueba en un entorno, su servidor necesita el Access Token correspondiente.
- **OpenStreetMap y la API de Geolocalización del navegador** para mostrar el punto de retiro simulado en la sede del Colegio Universitario IES, en Rondeau 165, Nueva Córdoba. El mapa se inserta mediante un iframe. Al pulsar **Calcular distancia**, el navegador pide permiso y estima la distancia en línea recta con la fórmula de Haversine. El cálculo se hace en el dispositivo. **Cómo llegar** abre Google Maps con el destino. [Dirección del IES](https://ies21.edu.ar/contacto/)

Gran parte del desarrollo se apoyó en conocimientos que adquirí anteriormente en un curso externo de desarrollo web en CoderHouse. Para el checkout, retomé en particular la integración que hice en el trabajo final de Backend con Node.js, donde el servidor preparaba una preferencia de pago. En Prime Snacks adapté ese mismo flujo a la API de órdenes de Checkout Pro. [Repositorio de Backend de CoderHouse](https://github.com/mirandajosee/Backend-CoderHouse)

## Mejora significativa

En la entrega parcial de integración, el recorrido de compra llegaba hasta el carrito y su total estimado. En la versión final amplié ese recorrido y mejoré la información disponible para el usuario.

- **Confirmación del pedido.** Incorporé un comprobante de demostración con número, productos, cantidades y total. Al confirmar, se vacía el carrito y el último comprobante queda disponible en el mismo navegador.
- **Control de disponibilidad.** Definí un máximo por producto en el catálogo de demostración. Las tarjetas tienen en cuenta las unidades que ya están en el carrito, y el mismo límite se aplica al sumar desde el carrito y al confirmar el pedido. Así se detecta un exceso antes de cerrar la compra.
- **Checkout de prueba con Mercado Pago.** Añadí una opción de pago de prueba desde el carrito. El servidor calcula el importe a partir del catálogo y obtiene la URL de Checkout Pro. La tienda comparte esa lógica entre el servidor local y Vercel.
- **Ubicación del punto de retiro.** Agregué un mapa interactivo en Contacto, un enlace con indicaciones y una estimación de distancia en línea recta. El cálculo usa la ubicación del usuario con su permiso, y la dirección y el enlace están siempre visibles.

## Video explicativo

- [Enlace al video](https://drive.google.com/file/d/1mAaxnBT3edSzhBTb7q7besQYOufWn4uK/view?usp=drive_link)
