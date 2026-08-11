# BV Home — Reversionado

Rediseño conceptual de [bvhome.com.ar](https://bvhome.com.ar), hoy montado sobre Tienda Nube (tema *Rio*).

El objetivo no es "hacer lo mismo más lindo": es mostrar **qué cosas concretas no podés hacer con Tienda Nube**, ni siquiera en su plan más alto, y cómo se ven cuando sí las podés hacer.

Sitio estático, sin build, sin dependencias. Se abre con doble clic.

---

## Ver la demo

**Online:** GitHub Pages (ver la solapa *Environments* del repo)

**Local:**

```bash
python -m http.server 8000
```

Después entrá a `http://localhost:8000`.

Páginas: `index.html` (home) · `tienda.html` (catálogo) · `producto.html?id=sofa-eden` (ficha).

---

## Lo que se agregó (y por qué importa)

### 1. Comprá el ambiente (*shop the look*)
Foto de ambiente real con puntos calientes sobre cada mueble. Tocás el punto, ves el producto y el precio, y hay un botón que **suma las cuatro piezas al carrito de una**.

> En Tienda Nube esto no existe. La foto de ambiente es una imagen muerta: el cliente ve el living armado, le gusta, y no tiene forma de comprarlo sin ponerse a buscar pieza por pieza. Acá el ticket promedio sube solo.

### 2. Carrito lateral, sin recargar la página
Agregás desde la grilla, desde la vista rápida o desde la ficha, y el carrito se abre al costado. Incluye **barra de progreso de envío gratis** ("te faltan $X"), el ahorro por transferencia calculado en vivo y cierre por WhatsApp con el pedido ya escrito.

> Tienda Nube te lleva a `/carrito` y te saca del flujo. La barra de envío gratis es de los recursos más probados para subir el ticket, y no viene.

### 3. Filtros que responden mientras tocás
Categoría, color, precio, stock y novedades — todo sin recargar, con la URL sincronizada (podés mandar el link filtrado por WhatsApp), chips de filtros activos y **contadores en vivo** que muestran cuántos productos quedan antes de aplicar el filtro.

> Los filtros de Tienda Nube recargan la página entera y no tienen contadores previos.

### 4. Buscador con resultados mientras escribís
Overlay a pantalla completa, `Ctrl/⌘ + K`, insensible a tildes y mayúsculas ("sillon boucle" encuentra *Sillón Luma*), busca también en materiales y descripciones, con sugerencias y estado vacío útil.

### 5. Ficha de producto que contesta antes de que pregunten
- **Comparador de medios de pago**: transferencia vs. 3, 6 y 12 cuotas, recalculado según la cantidad.
- **"¿Entra en tu espacio?"**: ponés el ancho y el fondo de tu ambiente y te dice si entra y **cuántos centímetros te sobran**, con un diagrama a escala.
- Selector de color/terminación, galería con zoom, medidas y materiales, stock real ("quedan 2"), barra de compra fija al scrollear y **consulta por WhatsApp con el producto y el precio ya cargados**.

> La pregunta nº 1 en muebles es "¿me entra?". Contestarla en la ficha saca consultas de encima y baja devoluciones.

### 6 bis. Si no entra, se la fabricamos
Acá está el remate. Cuando el verificador da que **no entra**, en vez de dejar al cliente con un "no", aparece una propuesta de fabricación a medida:

- Propone sola las dimensiones que sí entran en ese ambiente (el ancho declarado menos 20 cm de respiro, sin achicar por debajo del 60% del original).
- El diagrama pasa de rojo desbordado a verde entrando: se ve que ahora sí.
- Da un precio estimado. Achicar no abarata —el trabajo de fabricación es el mismo— y agrandar suma material. Recargo del 25% sobre lista.
- Botón de presupuesto por WhatsApp con las medidas del ambiente y las de la pieza ya escritas.
- Sólo aparece donde tiene sentido: sillones, mesas y muebles. En deco, no.

> Esta es **la** diferencia. Una tienda enlatada convierte "no me entra" en una venta perdida. Acá la convierte en una consulta de fabricación a medida, que además es el trabajo de mayor margen. BV Home fabrica: el sitio debería vender eso, y hoy no lo hace en ningún lado.

### 6. Modo oscuro
Sistema de tokens completo en claro y oscuro, respetando la preferencia del sistema y recordando la elección.

> No es un capricho estético: es la señal más rápida de "esto no es una plantilla".

### 7. El resto
Vista rápida en modal · Favoritos persistentes · Visto recientemente · Mega menú con imagen · Densidad de grilla (cómoda/compacta) · Animaciones de entrada al scroll · Micro-interacciones en tarjetas · Notificaciones tipo *toast*.

---

## El punto de fondo: la tipografía

En el sitio actual, **los carteles tienen el texto quemado dentro de la imagen**: "ENVÍO A TODO EL PAÍS", "20% OFF TRANSFERENCIA", "DECORACIÓN en tendencia". Se arman en Canva y se suben como banner.

Eso pasa porque el tema no deja poner tipografía real encima de una foto. Y trae cola:

- No se puede seleccionar ni traducir, y Google no lo lee (cero SEO en el mensaje principal).
- En celular el texto se achica junto con la foto y queda ilegible.
- Cambiar "20% OFF" por "25% OFF" es rehacer y resubir cinco imágenes.
- La tipografía cambia según quién armó el banner.

En esta versión **recorté las fotos originales para sacarles el texto** y lo rearmé como HTML. Ahora el titular es texto de verdad: escala, se lee, se indexa, y cambiarlo es editar una línea.

---

## Lo técnico (lo que va por detrás)

**SEO**
- `title`, `description` y `canonical` propios por página. En las fichas se arman según el `?id=`.
- **Datos estructurados JSON-LD**: `Organization` + `WebSite` con *SearchAction* en la home; `Product` + `Offer` + `BreadcrumbList` en cada ficha. Es lo que habilita que Google muestre precio, stock y migas en el resultado de búsqueda.
- `sitemap.xml` con las 46 URLs y `robots.txt` que bloquea las combinaciones de filtros (evita miles de URLs duplicadas sin contenido propio).
- Open Graph y Twitter Cards con imagen 1200×630, para que el link se vea bien al pegarlo en WhatsApp o Instagram.
- Un solo `<h1>` por página, jerarquía de encabezados correcta y `alt` en todas las imágenes.

**Rendimiento**
- Imágenes en tres tamaños (480 / 768 / 1024) servidas con `srcset` + `sizes`: en celular se bajan 480 px, no 1024.
- WebP en todo el catálogo, `loading="lazy"` fuera de pantalla, `fetchpriority="high"` y `preload` en la imagen del hero.
- `width` y `height` en todas las imágenes para que no salte el layout mientras carga (CLS).
- Cero dependencias, cero framework, cero build: cuatro archivos JS propios y una hoja de estilos.

**Accesibilidad**
- Link "saltar al contenido", foco visible, y foco atrapado y devuelto en carrito, filtros y buscador.
- `aria-label` en todos los botones de ícono, `role="status"` en las notificaciones, `aria-modal` en los paneles.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`.
- Contraste verificado en claro y oscuro.

**Otros**
- `404.html` con la identidad del sitio, `site.webmanifest` e íconos para "agregar a pantalla de inicio".

> Aclaración honesta: esto es lo que se puede resolver del lado del frontend. Lo que **no** cubre un sitio estático es lo de servidor —redirecciones 301, cabeceras de caché, hreflang, sitemap dinámico al publicar productos—. Eso entra recién cuando el sitio corre sobre un backend propio.

## Estructura

```
├── index.html            Home
├── tienda.html           Catálogo con filtros
├── producto.html         Ficha (?id=…)
└── assets/
    ├── css/style.css     Sistema de diseño (tokens, claro/oscuro)
    ├── js/
    │   ├── data.js       Catálogo, ambientes y configuración
    │   ├── app.js        Carrito, favoritos, buscador, UI compartida
    │   ├── home.js       Home + ambientes shoppables
    │   ├── tienda.js     Filtros, orden, URL
    │   └── producto.js   Ficha, pagos, medidas, galería
    └── img/              Fotos (productos + editorial)
```

Para cambiar precios o productos se toca **un solo archivo**: `assets/js/data.js`.

---

## Qué es real y qué es demo

Importante para no prometer de más en una reunión:

| Real | Demo |
|---|---|
| Los 40 productos, con sus nombres y precios de lista | Medidas, materiales y descripciones |
| Las fotos (de la tienda actual) | Stock y plazos de entrega |
| El 20% de transferencia y las 6 cuotas | Colores/terminaciones por producto |
| Paleta y aire de la marca | Los puntos sobre las fotos de ambiente |

El carrito guarda en `localStorage`: **no hay checkout ni pasarela de pago**. El cierre de compra sale por WhatsApp con el pedido armado, que es como opera hoy buena parte del rubro en Argentina.

---

## Nota

Trabajo conceptual, no afiliado a BV Home. Las imágenes y los datos de producto pertenecen a la marca y están usados con fines de demostración.
