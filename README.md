# Colsabor · Comida Sana — Menú Digital (PWA)

Menú digital para **Colsabor**, comida sana en **El Porvenir** (papas rellenas,
empanadas, arepas de huevo, desayunos, almuerzos, carnes, pescados, sopas,
acompañamientos y bebidas). Aplicación de una sola página (PWA), 100% estática,
sin servidor: los datos viven en el propio `index.html` y se persisten por
dispositivo en `localStorage`.

## Tecnología

- HTML5 / CSS3 / JavaScript Vanilla + Alpine.js
- Tailwind CSS y Font Awesome vía CDN
- PWA (`manifest.json` + `service-worker.js`)
- Datos: semilla local en `index.html` + `localStorage` (sin Firebase ni backend)

## Estructura del proyecto

```
/assets
  /logo        → logo-colsabor.png (coloca aquí el logo real), no-image.webp
  /galeria     → fotos de la galería (foto1.webp … foto5.webp)
  /videos      → videos de la sección multimedia (.mp4)
  /icons       → íconos PWA (icon-192.png, icon-512.png, favicon.png)

/data
  productos.json      → snapshot de referencia del catálogo (NO se usa en runtime)
  configuracion.json  → snapshot de referencia de promo/horario/categorías (NO se usa en runtime)

index.html
manifest.json
service-worker.js
README.md
```

> **Importante:** los archivos en `/data` son **solo de referencia / respaldo**.
> La aplicación nunca los carga en runtime: la fuente de verdad del menú es
> `productosIniciales` (constante dentro de `index.html`) y las ediciones del
> panel admin, que se guardan en `localStorage` de cada dispositivo.
> Si cambias el menú, actualiza **ambos** lugares: `productosIniciales` en
> `index.html` y `data/productos.json`.

## Datos de contacto actuales

- WhatsApp / teléfono: **+57 304 200 9142** (`wa.me/573042009142`)
- Ubicación: **El Porvenir** (el pin del mapa en `index.html` apunta a la
  ubicación real)

## Cómo funciona el menú

1. Al abrir la app por primera vez, el menú se carga desde `productosIniciales`
   (definido en el `<script>` de `index.html`) y se guarda en `localStorage`.
2. Cada producto tiene: `id`, `nombre`, `precio`, `categoria`, `imagen`
   (emoji o ruta de archivo) y `agotado`.
3. El botón 🔒 abre el **panel admin** (protegido con PIN) para gestionar el
   catálogo, la promoción y el horario (ver sección "Panel admin").
4. Para cambiar el menú **por defecto para todos los visitantes**, edita
   `productosIniciales` en `index.html` y actualiza `data/productos.json`.

## Panel admin (PIN)

Se abre con el botón 🔒 del encabezado y pide un **PIN** (por defecto `1234`;
cámbialo en la constante `ADMIN_PIN` dentro de `index.html`).

Permite, con sesión iniciada:

- **Editar el catálogo**: cambiar nombre, categoría y precio de cada producto,
  alternar disponibilidad (agotado/disponible) y eliminar productos.
- **Agregar productos** nuevos (con emoji o ruta de foto) con vista previa.
- **Editar la promoción** visible y el **horario** de atención.
- Ver estadísticas: total de productos, agotados y categorías.
- **Exportar el menú** como JSON (para publicarlo a todos los visitantes) y
  **restaurar el menú original** (valores de fábrica).

> Los cambios del panel se guardan en `localStorage` del **dispositivo donde
> editas** (no afectan a otros visitantes). Para que un cambio llegue a todos,
> usa "Exportar menú" y pega el JSON en `productosIniciales` del `index.html`
> y en `data/productos.json`.

## Categorías (fijas en la app)

1. Desayunos 🍳
2. Almuerzos 🍛
3. Carnes 🥩
4. Pescados 🐟
5. Sopas 🥣
6. Acompañamientos 🍟
7. Bebidas 🥤

## Imágenes de producto

- Si `p.imagen` es un **emoji** (ej: `'🥔'`), la tarjeta lo muestra como ícono.
- Si `p.imagen` es una **ruta** (ej: `assets/productos/algo.webp`), la tarjeta
  carga esa foto; el archivo debe existir con ese nombre exacto.
- Si falta o falla la imagen, se muestra `assets/logo/no-image.webp` como
  respaldo (nunca un ícono roto).

## Logo

La página carga `assets/logo/logo-colsabor.png`. Mientras ese archivo no
exista, se muestra un logo de respaldo (🥗). **Coloca el logo real de Colsabor
con ese nombre y ruta** para que aparezca en el encabezado, el modal QR y el
precache del service worker.

## Galería y videos

- Galería: `assets/galeria/foto1.webp` … `foto5.webp` (el carrusel muestra las
  que existan y oculta automáticamente las que falten).
- Videos: `assets/videos/*.mp4` (se ocultan solos si no existen).

## Carrito y pedidos por WhatsApp

El carrito permite agregar/quitar productos y cantidades, calcula el total y
genera un mensaje de WhatsApp dirigido a **+57 304 200 9142** con el detalle
del pedido.

## PWA / Offline

El `index.html` registra `service-worker.js` al cargar
(`navigator.serviceWorker.register(...)`), que precachea el shell de la app y
los assets locales, y captura el evento `beforeinstallprompt` para ofrecer el
botón **"Instalar ahora"** dentro del modal 📲 (con instrucciones manuales para
Android e iPhone).

## Despliegue

1. Sube el contenido de esta carpeta a la raíz del repositorio/host que uses.
2. Activa el hosting estático (GitHub Pages, Netlify, Vercel, etc.).
3. Abre `index.html` en el navegador — no requiere configuración adicional.

## Mejoras pendientes (fuera del alcance de la limpieza de marca)

- Colocar el logo real en `assets/logo/logo-colsabor.png` (hoy se muestra el
  respaldo 🥗 hasta que el archivo exista).
- Reemplazar `https://tudominio.com/...` en las meta tags `og:*` y `canonical`
  por la URL real de producción.
- Cuando haya fotos reales de los platos, asignarlas a cada producto
  (`p.imagen = 'assets/...webp'`); mientras tanto cada tarjeta muestra su emoji.
