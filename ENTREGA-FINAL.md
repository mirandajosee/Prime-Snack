# Entrega final de Aplicaciones Web 1

**Proyecto** — Prime Snacks  
**Estudiante** — José Eduardo Miranda Valderrama

## Proyecto publicado

- Plataforma de publicación — Vercel
- Enlace público — [Prime Snacks](https://prime-snack.vercel.app/)

## Roadmap de desarrollo

El desarrollo se organizó en cuatro etapas que siguen el orden de los módulos de Aplicaciones Web 1. Las fechas marcadas como orientativas sirven para ubicar las etapas que se extendieron más allá del plazo.

| Etapa | Fecha de referencia | Objetivo | Trabajo realizado | Iteraciones y cambios |
| --- | --- | --- | --- | --- |
| Estructura HTML y formularios | 30/08/2026, 23:59 (plazo cumplido) | [Por completar] | Maqueté Inicio, Barritas, Otros snacks y Contacto. Armé los formularios de ingreso y registro con etiquetas, tipos de campo y validación HTML. | El docente aprobó los formularios y señaló un enlace roto. Corregí la ruta del logo de Contacto hacia Inicio y unifiqué el uso de mayúsculas en el nombre del archivo del logo. |
| Identidad visual y diseño adaptable | 24/09/2026 (orientativa) | [Por completar] | Definí la paleta, diseñé el navbar y los formularios, y armé una tarjeta de producto y una grilla adaptable con CSS. | Reemplacé el logo, incorporé imágenes WebP y amplié el catálogo. La portada pasó de mostrar una barrita a presentar tres productos destacados. |
| Interactividad con JavaScript | 22/10/2026 (orientativa) | [Por completar] | Implementé las redirecciones de ingreso y salida. Generé el navbar y las tarjetas a partir de arreglos de objetos y agregué controles de cantidad por producto. | Reemplacé el HTML repetido de la navegación y del catálogo por componentes reutilizables. Conservé la validación nativa de los formularios y probé los enlaces y controles en escritorio y móvil. |
| Integración y entrega final | 20/11/2026 (plazo previsto) | [Por completar] | Cargué el catálogo JSON mediante `fetch`, guardé el correo de la sesión en `sessionStorage` y construí un carrito por usuario con `localStorage`. | Agrupé los cinco productos de Inicio en dos categorías. Moví el acceso al carrito junto a Cerrar sesión, agregué controles para sumar y restar unidades, y reinicié a cero el selector de la tarjeta al añadir. Incorporé un límite de disponibilidad por pedido y un comprobante local. El checkout de prueba con Mercado Pago queda previsto como extensión. |

## Tecnologías utilizadas

- **HTML y CSS** para la estructura, los formularios y el diseño adaptable. Flexbox y Grid organizan la navegación y las tarjetas.
- **JavaScript y las API del navegador** para generar componentes, leer el catálogo JSON con `fetch`, mantener la sesión de demostración por pestaña y guardar el carrito y el último pedido por correo.
- **Tecnología adicional prevista** — Mercado Pago Checkout Pro mediante su API de órdenes y una función HTTP sencilla en Node.js. La integración permitiría pasar del carrito a un checkout de prueba. La función recibiría identificadores y cantidades, validaría el pedido contra el catálogo, crearía la orden y devolvería el enlace de pago. El Access Token de prueba quedaría en una variable de entorno privada del servidor.

## Mejora significativa

- En la entrega de integración, el carrito permitía modificar cantidades y consultar el total estimado.
- La versión final aplica un máximo por pedido según la disponibilidad del catálogo de demostración. El límite considera lo que ya está en el carrito. Al confirmar, se guarda un comprobante con número de pedido, detalle y total, y se vacía el carrito.
- Para comprobarlo, agregá unidades hasta el máximo, revisá el límite desde el carrito y confirmá el pedido. El resumen vuelve a aparecer después de recargar. La extensión de Mercado Pago se probará por separado con credenciales y medios de pago de prueba.

## Video explicativo

- Enlace al video — [Por completar]
- Páginas, accesos y funcionalidades que se mostrarán — [Por completar]
- Guion de voz en off para público general y técnico — [Por completar]
- Reflexión personal opcional — [Por completar si corresponde]
