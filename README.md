# Colsabor · Comida Sana — Menú Digital + Panel Admin (PWA)

Menú digital de **Colsabor** (comida sana, El Porvenir) con **panel de
administración** y **base de datos en Firebase Realtime Database**.
Aplicación de una sola página (PWA), sin frameworks de servidor.

- 📱 WhatsApp de pedidos: **+57 304 200 9142**
- 🔗 URL pública: **https://konfiozinc.github.io/colsabor/**
- ⚙️ Admin: botón 🔒 del encabezado → PIN por defecto **1234** (cambiar en `scripts.js` → `ADMIN_PIN`)

## 🧱 Estructura

```
Colsabor/
├── index.html                 ← interfaz (menú, carrito, reseñas, panel admin)
├── scripts.js                 ← lógica: catálogo, admin, Firebase, PWA
├── manifest.json              ← PWA
├── service-worker.js          ← caché offline (v3)
├── data/
│   ├── configuracion.json     ← horario, promo, contacto, categorías
│   ├── productos.json         ← espejo del catálogo (31 productos)
│   └── firebase-config.json   ← 🔑 AQUÍ van las claves de Firebase
├── assets/
│   ├── logo/logo-colsabor.jpg ← logo REAL (convertido de logo.jpeg) + copia original
│   ├── productos/             ← fotos reales: papas-rellenas.jpg, empanadas.jpg, arepas-de-huevo.jpg
│   ├── icons/                 ← iconos PWA 192/512 + favicon (generados del logo real)
│   └── galeria/foto1..5.webp  ← galería
└── README.md
```

## 🍽️ Catálogo actual (29 productos · 5 categorías)

| Categoría | # | Productos |
|---|---|---|
| **Desayunos** | 6 | Papas rellenas 📷 · Empanadas 📷 · Arepas de huevo 📷 · Yuca con chicharrón · Patacón con queso · Patacón con huevos pericos |
| **Almuerzos** | 16 | Arroz de coco frito · Bandeja paisa · Pechuga a la plancha · Carne de res · Carne de cerdo a la plancha · Carne en bistec · Carne desmechada · Hígado encebollado · Mojarra roja · Sierra cojinua (lebranche) · Pescado en zumo de coco · Sopa de pescado · Sopa de mondongo · Sancocho de gallina · Sancocho de costilla de res · Arroz de coco |
| **Comidas** | 11 | Arroz de coco frito · Bandeja paisa · Pechuga a la plancha · Carne de res · Carne de cerdo a la plancha · Carne en bistec · Carne desmechada · Hígado encebollado · Mojarra roja · Sierra cojinua (lebranche) · Arroz de coco |
| **Jugos** | 5 | Piña · Maracuyá · Naranja · Tamarindo · Corozo |
| **Bebidas** | 2 | Chocolate · Café con leche |

📷 = tiene foto real asignada en `assets/productos/`.

**Categorías múltiples:** los 11 platos que van en *Almuerzos* **y** *Comidas* no se
duplican: el producto tiene `categoria: "Almuerzos"` + `categorias: ["Comidas"]`,
y el menú lo muestra en ambas. Esto se edita desde el panel admin con el campo
**"También en…"** (categorías extra separadas por coma).

> Los precios están en `0`: el menú muestra **"Precio por confirmar"** hasta que
> se definan desde el panel admin o en Firebase.

## 🔥 Activar Firebase (5 pasos)

1. Crear proyecto en <https://console.firebase.google.com> (ej: `colsabor`).
2. **Compilación → Realtime Database → Crear base de datos** (modo de prueba para empezar).
3. **Configuración del proyecto → Tus apps → Web (`</>`)** → copiar el objeto de configuración.
4. Pegar las claves en **`data/firebase-config.json`** (`apiKey`, `databaseURL`, `projectId`, …).
5. Abrir la tarjeta: el panel admin mostrará **"🔥 Firebase conectado"**.
   Entra al panel → **Datos → ⬆️ Subir catálogo a Firebase** (primera carga).

**Reglas sugeridas** (Realtime Database → Reglas), para que los visitantes solo lean:

```json
{
  "rules": {
    "menu": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

> Si más adelante quieres login real del admin, se activa **Authentication**
> (correo/contraseña) y se cambia la regla `.write` a `auth.uid === "TU_UID"`.
> Mientras tanto, el PIN del panel es solo una barrera de interfaz (el sitio es
> estático), por eso conviene la regla de escritura autenticada.

**Modo local (sin Firebase):** si `firebase-config.json` sigue con los valores
de ejemplo, la app funciona igual, guardando en `localStorage` — ideal para
probar y para publicar mientras el cliente entrega las claves.

## 🧭 Qué puede hacer el admin

- ➕ **Agregar** productos (nombre, precio, categoría, emoji o ruta de foto).
- ✏️ **Editar** nombre, categoría y precio en línea (se guarda al salir del campo).
- 🚫 **Ocultar/deshabilitar** productos no disponibles (botón "Agotar" → el menú los marca AGOTADO).
- 🗑️ **Eliminar** productos.
- 📣 Editar **promoción** y **horario** de atención.
- 📋 **Exportar** el catálogo en JSON y ↩️ **Restaurar** el menú original.
- ⬆️ **Subir catálogo a Firebase** (carga masiva inicial).

Con Firebase conectado, todos los cambios se reflejan **en vivo** para los
visitantes (suscripción `onValue` al nodo `menu/productos`).

## 🗂️ Nodos en Firebase

| Nodo | Contenido |
|---|---|
| `menu/productos/{id}` | `{ nombre, precio, categoria, imagen, agotado }` |
| `menu/promo` | Texto de la promoción visible |
| `menu/horario` | `{ dias: "1,2,3,4,5,6", inicio: 7, fin: 21 }` |

## 🔎 Metadatos (SEO / compartir)

`index.html` ya apunta a Colsabor: `og:title`, `og:description`, `og:image`,
`og:url` y `canonical` usan **https://konfiozinc.github.io/colsabor/** y el logo.
Si publicas en otro dominio, cambia esas 4 líneas y `NEGOCIO.url` en `scripts.js`.

## 🎨 Marca

- Verde Colsabor `#2E7D32` / `#1B5E20`, acento `#F0B429`.
- **Logo:** ✅ real (viene de `logo.jpeg` → `assets/logo/logo-colsabor.jpg`, 600×600 optimizado);
  los iconos PWA (192/512/favicon) se generaron desde ese logo.
- **Fotos de productos:** ✅ las 3 que entregó el cliente están ubicadas y conectadas:
  `assets/productos/papas-rellenas.jpg` (Papas rellenas), `empanadas.jpg` (Empanadas),
  `arepas-de-huevo.jpg` (Arepas de huevo). Los originales quedaron en
  `assets/productos/_originales/`. Los demás productos usan emoji hasta que lleguen sus fotos.
- Fuente: Montserrat.

## 🚀 Publicar (GitHub Pages)

1. Sube **todo** el contenido de la carpeta a la raíz del repositorio.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. URL: `https://<usuario>.github.io/colsabor/` (HTTPS ⇒ PWA instalable).

## ✅ Pendientes sugeridos

- Pegar las claves de Firebase en `data/firebase-config.json` (y aplicar reglas).
- Definir **precios** de los 31 productos (panel admin o Firebase).
- Reemplazar el **logo provisional** por el definitivo.
- Fotos reales de los platos (hoy cada producto usa su emoji).
- Correo/redes del negocio si se quieren mostrar.
