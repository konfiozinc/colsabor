// ══════════════════════════════════════════════════════════════
//  COL SABOR · Comida sana — Lógica del menú, panel admin y datos
//  Base de datos: Firebase Realtime Database (con respaldo local)
// ══════════════════════════════════════════════════════════════

// ── Configuración general ──
const NEGOCIO = {
    nombre: 'Colsabor',
    eslogan: 'Comida sana',
    telefono: '3042009142',
    whatsapp: '573042009142',
    mensajePedido: 'Hola Colsabor, quiero hacer un pedido 🍽️',
    ubicacion: 'El Porvenir',
    url: 'https://konfiozinc.github.io/colsabor/'
};

let CATEGORIAS = ['Desayunos', 'Almuerzos', 'Comidas', 'Jugos', 'Bebidas'];
const ADMIN_PIN = '1234'; // PIN del panel admin — cámbialo aquí.

const EMOJIS_CATEGORIA = {
    'Desayunos': '🍳',
    'Almuerzos': '🍛',
    'Comidas': '🍽️',
    'Jugos': '🧃',
    'Bebidas': '☕'
};

// ── Utilidades ──
function esImagenEmoji(valor) {
    if (typeof valor !== 'string' || !valor) return false;
    if (valor.length > 16) return false;
    if (valor.includes('/') || valor.includes('\\')) return false;
    if (/\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)$/i.test(valor)) return false;
    return true;
}
function copiaInicial() { return JSON.parse(JSON.stringify(productosIniciales)); }
function idDesdeNombre(txt) {
    return 'col-' + String(txt).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function productosAObjeto(lista) {
    const obj = {};
    lista.forEach(function (p) {
        obj[p.id] = {
            nombre: p.nombre, precio: p.precio, categoria: p.categoria,
            imagen: p.imagen, agotado: !!p.agotado,
            categorias: Array.isArray(p.categorias) ? p.categorias : [],
            etiquetas: Array.isArray(p.etiquetas) ? p.etiquetas : [],
            tiempo: Number(p.tiempo) || 0,
            destacado: !!p.destacado
        };
    });
    return obj;
}
function objetoAProductos(obj) {
    if (!obj) return [];
    return Object.keys(obj).map(function (id) {
        const v = obj[id] || {};
        return {
            id: id, nombre: v.nombre || '', precio: Number(v.precio) || 0,
            categoria: v.categoria || CATEGORIAS[0], imagen: v.imagen || '🍽️',
            categorias: Array.isArray(v.categorias) ? v.categorias : [],
            etiquetas: Array.isArray(v.etiquetas) ? v.etiquetas : [],
            tiempo: Number(v.tiempo) || 0,
            destacado: !!v.destacado,
            agotado: !!v.agotado
        };
    });
}

// ══════════════════════════════════════════════════════════════
//  CATÁLOGO INICIAL (según la lista del cliente: 30 productos)
//  precio: 0 = "Precio por confirmar" (el admin lo define)
// ══════════════════════════════════════════════════════════════
const productosIniciales = [
    // ══ DESAYUNOS ══
    { id: 'col-papas-rellenas',      nombre: 'Papas rellenas',              precio: 0, categoria: 'Desayunos', imagen: 'assets/productos/papas-rellenas.jpg',  agotado: false },
    { id: 'col-empanadas',           nombre: 'Empanadas',                   precio: 0, categoria: 'Desayunos', imagen: 'assets/productos/empanadas.jpg',       agotado: false },
    { id: 'col-arepas-huevo',        nombre: 'Arepas de huevo',             precio: 0, categoria: 'Desayunos', imagen: 'assets/productos/arepas-de-huevo.jpg',  agotado: false },
    { id: 'col-desayuno-mixto',      nombre: 'Desayuno mixto',              precio: 0, categoria: 'Desayunos', imagen: 'assets/productos/desayuno-mixto.jpg',   agotado: false },
    { id: 'col-yuca-chicharron',     nombre: 'Yuca con chicharrón',         precio: 0, categoria: 'Desayunos', imagen: 'assets/productos/yuca-chicharron.jpg', agotado: false },
    { id: 'col-patacon-queso',       nombre: 'Patacón con queso',           precio: 0, categoria: 'Desayunos', imagen: 'assets/productos/patacon-queso.jpg',   agotado: false },
    { id: 'col-patacon-huevos',      nombre: 'Patacón con huevos pericos',  precio: 0, categoria: 'Desayunos', imagen: 'assets/productos/patacon-huevos.jpg',  agotado: false },

    // ══ ALMUERZOS ══ (los que también van en "Comidas" llevan categorias: ['Comidas'])
    { id: 'col-arroz-coco-frito',    nombre: 'Arroz de coco frito',         precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/arroz-coco-frito.jpg',  categorias: ['Comidas'], agotado: false },
    { id: 'col-bandeja-paisa',       nombre: 'Bandeja paisa',               precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/bandeja-paisa.jpg',     categorias: ['Comidas'], agotado: false },
    { id: 'col-pechuga-plancha',     nombre: 'Pechuga a la plancha',        precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/pechuga-plancha.jpg',   categorias: ['Comidas'], agotado: false },
    { id: 'col-carne-cerdo',         nombre: 'Carne de cerdo a la plancha', precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/carne-cerdo.jpg',       categorias: ['Comidas'], agotado: false },
    { id: 'col-carne-bistec',        nombre: 'Carne en bistec',             precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/carne-bistec.jpg',      categorias: ['Comidas'], agotado: false },
    { id: 'col-carne-desmechada',    nombre: 'Carne desmechada',            precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/carne-desmechada.jpg',  categorias: ['Comidas'], agotado: false },
    { id: 'col-higado-encebollado',  nombre: 'Hígado encebollado',          precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/higado-encebollado.jpg', categorias: ['Comidas'], agotado: false },
    { id: 'col-mojarra-roja',        nombre: 'Mojarra roja',                precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/mojarra-roja.webp',     categorias: ['Comidas'], agotado: false },
    { id: 'col-sierra-cojinua',      nombre: 'Sierra cojinua (lebranche)',  precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/sierra-cojinua.jpg',    categorias: ['Comidas'], agotado: false },
    { id: 'col-pescado-zumo-coco',   nombre: 'Pescado en zumo de coco',     precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/pescado-zumo-coco.jpg', agotado: false },
    { id: 'col-sopa-pescado',        nombre: 'Sopa de pescado',             precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/sopa-pescado.jpg',      agotado: false },
    { id: 'col-sopa-mondongo',       nombre: 'Sopa de mondongo',            precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/sopa-mondongo.jpg',     agotado: false },
    { id: 'col-sancocho-gallina',    nombre: 'Sancocho de gallina',         precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/sancocho-gallina.jpg',  agotado: false },
    { id: 'col-sancocho-costilla',   nombre: 'Sancocho de costilla de res', precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/sancocho-costilla.jpg', agotado: false },
    { id: 'col-arroz-coco',          nombre: 'Arroz de coco',               precio: 0, categoria: 'Almuerzos', imagen: 'assets/productos/arroz-coco.jpg',        categorias: ['Comidas'], agotado: false },

    // ══ JUGOS ══
    { id: 'col-jugo-pina',           nombre: 'Jugo de piña',                precio: 0, categoria: 'Jugos', imagen: 'assets/productos/jugo-pina.jpg',       agotado: false },
    { id: 'col-jugo-maracuya',       nombre: 'Jugo de maracuyá',            precio: 0, categoria: 'Jugos', imagen: 'assets/productos/jugo-maracuya.jpg',   agotado: false },
    { id: 'col-jugo-naranja',        nombre: 'Jugo de naranja',             precio: 0, categoria: 'Jugos', imagen: 'assets/productos/jugo-naranja.jpg',    agotado: false },
    { id: 'col-jugo-tamarindo',      nombre: 'Jugo de tamarindo',           precio: 0, categoria: 'Jugos', imagen: 'assets/productos/jugo-tamarindo.jpg',  agotado: false },
    { id: 'col-jugo-corozo',         nombre: 'Jugo de corozo',              precio: 0, categoria: 'Jugos', imagen: 'assets/productos/jugo-corozo.jpg',     agotado: false },

    // ══ BEBIDAS ══
    { id: 'col-chocolate',           nombre: 'Chocolate',                   precio: 0, categoria: 'Bebidas', imagen: 'assets/productos/chocolate.jpg',   agotado: false },
    { id: 'col-cafe-leche',          nombre: 'Café con leche',              precio: 0, categoria: 'Bebidas', imagen: 'assets/productos/cafe-leche.jpg',  agotado: false }
];

// ══════════════════════════════════════════════════════════════
//  FIREBASE REALTIME DATABASE (compat SDK — mismo patrón que EL TITI)
//  Proyecto: el-titi-menu · ruta: colsabor/
//  Si Firebase no está disponible, la app funciona en MODO LOCAL.
// ══════════════════════════════════════════════════════════════
const firebaseConfig = {
    apiKey: "AIzaSyDHWE3OJMspi_z0CKPv8mjvjI7igum98rs",
    authDomain: "el-titi-menu.firebaseapp.com",
    databaseURL: "https://el-titi-menu-default-rtdb.firebaseio.com",
    projectId: "el-titi-menu",
    storageBucket: "el-titi-menu.firebasestorage.app",
    messagingSenderId: "903648110789",
    appId: "1:903648110789:web:6ac58748862dfeb5a568ac"
};

const FB = { activo: false, db: null, error: '' };

function initFirebase() {
    try {
        if (typeof firebase === 'undefined') { FB.error = 'Firebase SDK no cargado'; return false; }
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        FB.db = firebase.database();
        FB.activo = true;
        FB.error = '';
        console.info('[Colsabor] Firebase conectado (colsabor/)');
        return true;
    } catch (e) {
        FB.error = e && e.message ? e.message : 'error desconocido';
        console.warn('[Colsabor] Firebase no disponible → modo local:', FB.error);
        return false;
    }
}
function fbRef(path) { return FB.db.ref(path); }
async function fbLeer(path) { const s = await fbRef(path).once('value'); return s.exists() ? s.val() : null; }
async function fbSet(path, valor) { await fbRef(path).set(valor); }
async function fbDel(path) { await fbRef(path).remove(); }
function fbOn(path, cb) { fbRef(path).on('value', cb); }

// ── Estado global (Alpine) ──
document.addEventListener('alpine:init', () => {
    Alpine.data('appData', function () {
        return {
            // Estado
            isOpen: true,
            productos: [],
            promoText: '🥗 PROMO DE LA SEMANA: 2x1 en Jugos Naturales',
            busqueda: '',
            categorias: CATEGORIAS,
            emojisCategoria: EMOJIS_CATEGORIA,
            carrito: [],
            carritoOpen: false,
            checkoutOpen: false,
            checkout: { nombre: '', telefono: '', direccion: '', metodoPago: 'Efectivo', notas: '' },
            enviandoPedido: false,
            metodosPago: ['Efectivo', 'Nequi', 'Daviplata', 'Transferencia'],
            reseñas: [],
            nuevaReseña: { autor: '', texto: '', estrellas: 0 },
            adminMode: false,
            adminAuthenticated: false,
            adminEmail: '',
            adminPassword: '',
            loginEnProgreso: false,
            newProduct: { nombre: '', precio: '', imagen: '', categoria: CATEGORIAS[0] },
            previewNuevo: '',
            previewPorId: {},
            adminHorario: { dias: '1,2,3,4,5,6', inicio: 7, fin: 21 },
            horarioTexto: 'Lunes a Sábado · 7:00 AM a 9:00 PM',
            qrModalOpen: false,
            installModalOpen: false,
            installTab: 'android',
            telefono: NEGOCIO.telefono,
            ubicacion: NEGOCIO.ubicacion,
            urlPublica: NEGOCIO.url,
            // Datos
            fuente: 'local',          // 'firebase' | 'local'
            fbError: '',
            guardando: false,

            // Getters
            get productosVisibles() { return this.productos.filter(p => !p.agotado); },
            get productosFiltrados() {
                const q = this.busqueda.trim().toLowerCase();
                const base = this.productosVisibles;
                if (!q) return base;
                return base.filter(p => p.nombre.toLowerCase().includes(q));
            },
            get categoriasConProductos() {
                return this.categorias.map(cat => {
                    const productos = this.productosFiltrados.filter(p =>
                        p.categoria === cat || (Array.isArray(p.categorias) && p.categorias.includes(cat))
                    );
                    return { nombre: cat, emoji: this.emojisCategoria[cat] || '🍽️', productos, count: productos.length };
                });
            },
            get destacados() {
                return this.productosVisibles.filter(p => !!p.destacado);
            },
            get totalItems() { return this.carrito.reduce((s, i) => s + i.cantidad, 0); },
            get totalPrecio() { return this.carrito.reduce((s, i) => s + i.precio * i.cantidad, 0); },
            get promedioEstrellas() {
                if (!this.reseñas.length) return 0;
                return (this.reseñas.reduce((s, r) => s + (r.estrellas || 0), 0) / this.reseñas.length).toFixed(1);
            },
            get textoFuente() {
                if (this.fuente === 'firebase') return '🔥 Firebase conectado (cambios en vivo)';
                return '💾 Modo local (sin conexión a Firebase)';
            },

            // ── Inicialización ──
            // 1) Cargar contenido base desde Pages CMS (data/*.json)
            async cargarContenidoBase() {
                try {
                    const resp = await fetch('data/configuracion.json', { cache: 'no-store' });
                    if (resp.ok) {
                        const cfg = await resp.json();
                        if (cfg.promocion) this.promoText = cfg.promocion;
                        if (Array.isArray(cfg.categorias) && cfg.categorias.length) this.categorias = cfg.categorias;
                        if (cfg.horario && cfg.horario.dias) { this.adminHorario = cfg.horario; this.actualizarTextoHorario(); }
                        if (cfg.telefono) { NEGOCIO.telefono = cfg.telefono; this.telefono = cfg.telefono; }
                        if (cfg.whatsapp) NEGOCIO.whatsapp = cfg.whatsapp;
                        if (cfg.ubicacion) { NEGOCIO.ubicacion = cfg.ubicacion; this.ubicacion = cfg.ubicacion; }
                        if (cfg.url) { NEGOCIO.url = cfg.url; this.urlPublica = cfg.url; }
                    }
                } catch (e) { console.warn('[Colsabor] No se pudo leer configuracion.json:', e); }

                try {
                    const resp = await fetch('data/productos.json', { cache: 'no-store' });
                    if (resp.ok) {
                        const data = await resp.json();
                        const lista = Array.isArray(data) ? data : (data.productos || []);
                        if (lista.length) {
                            this.productos = lista.map(p => ({
                                id: p.id, nombre: p.nombre, precio: Number(p.precio) || 0,
                                categoria: p.categoria, imagen: p.imagen,
                                categorias: Array.isArray(p.categorias) ? p.categorias : [],
                                etiquetas: Array.isArray(p.etiquetas) ? p.etiquetas : [],
                                tiempo: Number(p.tiempo) || 0,
                                destacado: !!p.destacado,
                                agotado: !!p.agotado
                            }));
                            localStorage.setItem('colsabor_productos_v2', JSON.stringify(this.productos));
                        }
                    }
                } catch (e) { console.warn('[Colsabor] No se pudo leer productos.json:', e); }
            },
            async initApp() {
                // 1) Contenido base desde Pages CMS
                await this.cargarContenidoBase();

                // 2) Datos locales de respaldo (solo si el JSON no cargó productos)
                const stored = localStorage.getItem('colsabor_productos_v2');
                if (!this.productos.length && stored) {
                    try { this.productos = JSON.parse(stored); } catch (e) { this.productos = copiaInicial(); }
                }
                if (!this.productos.length) {
                    this.productos = copiaInicial();
                    localStorage.setItem('colsabor_productos_v2', JSON.stringify(this.productos));
                }
                const rev = localStorage.getItem('colsabor_reseñas');
                if (rev) { try { this.reseñas = JSON.parse(rev); } catch (e) {} }
                const hor = localStorage.getItem('colsabor_horario');
                if (hor) { try { this.adminHorario = JSON.parse(hor); this.actualizarTextoHorario(); } catch (e) {} }
                const prom = localStorage.getItem('colsabor_promo');
                if (prom) this.promoText = prom;

                this.actualizarEstado();
                setInterval(() => this.actualizarEstado(), 60000);

                setTimeout(() => {
                    const inp = document.querySelector('.review-form input[type="text"]');
                    if (inp) inp.removeAttribute('readonly');
                }, 500);

                // 3) Firebase (si está configurado) — sobrescribe en vivo
                const ok = await initFirebase();
                this.fuente = ok ? 'firebase' : 'local';
                this.fbError = FB.error || '';
                if (!ok) return;

                // Catálogo en vivo
                fbOn('colsabor/productos', (snap) => {
                    const lista = objetoAProductos(snap.val());
                    if (lista.length) {
                        this.productos = JSON.parse(JSON.stringify(lista));
                        localStorage.setItem('colsabor_productos_v2', JSON.stringify(lista));
                    }
                });
                fbOn('colsabor/promo', (snap) => {
                    if (snap.exists()) { this.promoText = snap.val(); localStorage.setItem('colsabor_promo', this.promoText); }
                });
                fbOn('colsabor/horario', (snap) => {
                    if (snap.exists()) {
                        const h = snap.val();
                        if (h && h.dias) { this.adminHorario = h; this.actualizarTextoHorario(); this.actualizarEstado(); }
                    }
                });
            },

            // ── Guardado (Firebase o local) ──
            async guardarProducto(p) {
                this.guardando = true;
                try {
                    if (FB.activo) {
                        await fbSet('colsabor/productos/' + p.id, {
                            nombre: p.nombre, precio: Number(p.precio) || 0,
                            categoria: p.categoria, imagen: p.imagen, agotado: !!p.agotado,
                            categorias: Array.isArray(p.categorias) ? p.categorias : [],
                            etiquetas: Array.isArray(p.etiquetas) ? p.etiquetas : []
                        });
                    }
                    localStorage.setItem('colsabor_productos_v2', JSON.stringify(this.productos));
                } catch (e) {
                    this.mostrarToast('⚠️ No se pudo guardar en Firebase');
                }
                this.guardando = false;
            },
            async sincronizarProducto(p) { await this.guardarProducto(p); },
            async persistirProductos() {
                localStorage.setItem('colsabor_productos_v2', JSON.stringify(this.productos));
                if (FB.activo) {
                    try { await fbSet('colsabor/productos', productosAObjeto(this.productos)); }
                    catch (e) { this.mostrarToast('⚠️ Error sincronizando con Firebase'); }
                }
            },
            async subirCatalogo() {
                if (!FB.activo) { this.mostrarToast('⚠️ Firebase no está configurado'); return; }
                if (!confirm('¿Subir el catálogo actual a Firebase? Se reemplaza lo que haya en colsabor/productos.')) return;
                this.guardando = true;
                try {
                    await fbSet('colsabor/productos', productosAObjeto(this.productos));
                    this.mostrarToast('⬆️ Catálogo subido a Firebase');
                } catch (e) { this.mostrarToast('⚠️ Error al subir el catálogo'); }
                this.guardando = false;
            },

            // ── Productos ──
            agregarAlCarrito(p) {
                const idx = this.carrito.findIndex(i => i.id === p.id);
                if (idx >= 0) { this.carrito[idx].cantidad++; }
                else { this.carrito.push({ id: p.id, nombre: p.nombre, precio: Number(p.precio) || 0, emoji: esImagenEmoji(p.imagen) ? p.imagen : '🍔', cantidad: 1 }); }
                this.mostrarToast('🛒 ' + p.nombre + ' agregado');
            },
            quitarUno(id) {
                const idx = this.carrito.findIndex(i => i.id === id);
                if (idx < 0) return;
                if (this.carrito[idx].cantidad > 1) { this.carrito[idx].cantidad--; }
                else { this.carrito.splice(idx, 1); }
            },
            vaciarCarrito() { if (confirm('¿Vaciar el carrito?')) this.carrito = []; },
            enviarPedido() {
                if (!this.carrito.length) return;
                this.carritoOpen = false;
                this.checkoutOpen = true;
            },

            async confirmarPedido() {
                if (!this.carrito.length) return;
                const c = this.checkout;
                if (!c.nombre.trim() || !c.telefono.trim() || !c.direccion.trim()) {
                    this.mostrarToast('⚠️ Completa nombre, teléfono y dirección');
                    return;
                }
                if (this.enviandoPedido) return;
                this.enviandoPedido = true;

                // 1) Número de pedido incremental (transacción atómica)
                let numeroPedido = 'CLS-000';
                try {
                    const res = await fbRef('colsabor/meta/contadorPedidos').transaction((v) => (v || 0) + 1);
                    if (res && res.snapshot && res.snapshot.val()) {
                        numeroPedido = 'CLS-' + String(res.snapshot.val()).padStart(3, '0');
                    }
                } catch (e) { console.warn('[Colsabor] contador falló, se usa por defecto:', e); }

                // 2) Código corto de consulta pública
                const codigoConsulta = Math.random().toString(36).slice(2, 6).toUpperCase();

                // 3) Guardar el pedido en RTDB (colsabor/pedidos)
                const pedido = {
                    numeroPedido,
                    codigoConsulta,
                    cliente: {
                        nombre: c.nombre.trim(),
                        telefono: c.telefono.trim(),
                        direccion: c.direccion.trim(),
                        metodoPago: c.metodoPago,
                        notas: c.notas.trim()
                    },
                    items: this.carrito.map(i => ({ productoId: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })),
                    total: this.totalPrecio,
                    estado: 'recibido',
                    fechaCreacion: firebase.database.ServerValue.TIMESTAMP,
                    fechaActualizacion: firebase.database.ServerValue.TIMESTAMP
                };
                try {
                    await fbRef('colsabor/pedidos').push(pedido);
                } catch (e) {
                    console.error('[Colsabor] No se pudo guardar el pedido:', e);
                    this.mostrarToast('⚠️ No se guardó en el panel, pero continuamos por WhatsApp');
                }

                // 4) Abrir WhatsApp con el mensaje de siempre + datos del cliente
                let msg = '\u{1F354} *PEDIDO - Colsabor Comida sana*\n';
                msg += '\u{1F464} ' + c.nombre + ' \u00B7 ' + c.telefono + '\n';
                msg += '\n';
                this.carrito.forEach(i => {
                    msg += i.emoji + ' *' + i.nombre + '*\n   Cantidad: ' + i.cantidad + '\n   Precio: $' + (i.precio * i.cantidad).toLocaleString('es-CO') + '\n\n';
                });
                msg += '\n\u{1F4B0} *TOTAL: $' + this.totalPrecio.toLocaleString('es-CO') + '*\n';
                msg += '\u{1F4CD} Direcci\u00F3n: ' + c.direccion + '\n';
                msg += '\u{1F4B3} Pago: ' + c.metodoPago + '\n';
                if (c.notas) msg += '\u{1F4DD} Notas: ' + c.notas + '\n';
                msg += '\n\u{1F194} Pedido ' + numeroPedido;
                window.location.href = 'whatsapp://send?phone=57' + this.telefono + '&text=' + encodeURIComponent(msg);

                // 5) Reset del estado
                this.carrito = [];
                this.checkoutOpen = false;
                this.checkout = { nombre: '', telefono: '', direccion: '', metodoPago: 'Efectivo', notas: '' };
                this.enviandoPedido = false;
            },

            // ── Reseñas ──
            enviarReseña() {
                if (!this.nuevaReseña.autor.trim()) { this.mostrarToast('⚠️ Escribe tu nombre'); return; }
                if (!this.nuevaReseña.estrellas) { this.mostrarToast('⚠️ Selecciona las estrellas'); return; }
                const r = {
                    autor: this.nuevaReseña.autor.trim(),
                    texto: this.nuevaReseña.texto.trim(),
                    estrellas: this.nuevaReseña.estrellas,
                    fecha: Date.now()
                };
                this.reseñas.unshift(r);
                localStorage.setItem('colsabor_reseñas', JSON.stringify(this.reseñas));
                this.nuevaReseña = { autor: '', texto: '', estrellas: 0 };
                this.mostrarToast('⭐ ¡Gracias por tu reseña!');
            },

            // ── Horario ──
            actualizarTextoHorario() {
                const dias = String(this.adminHorario.dias || '').split(',').map(Number);
                const nombres = dias.map(d => {
                    if (d === 0) return 'Domingo';
                    if (d === 1) return 'Lunes';
                    if (d === 2) return 'Martes';
                    if (d === 3) return 'Miércoles';
                    if (d === 4) return 'Jueves';
                    if (d === 5) return 'Viernes';
                    if (d === 6) return 'Sábado';
                    return '';
                }).filter(Boolean);
                const fmt = (h) => {
                    if (h === 0) return '12:00 AM';
                    if (h < 12) return h + ':00 AM';
                    if (h === 12) return '12:00 PM';
                    return (h - 12) + ':00 PM';
                };
                this.horarioTexto = nombres.join(' – ') + ' · ' + fmt(this.adminHorario.inicio) + ' a ' + fmt(this.adminHorario.fin);
            },
            async guardarHorario() {
                let dias = String(this.adminHorario.dias).split(',').map(Number).filter(d => !isNaN(d) && d >= 0 && d <= 6);
                if (dias.length === 0) { this.mostrarToast('Debe ingresar al menos un día'); return; }
                this.adminHorario.dias = dias.join(',');
                localStorage.setItem('colsabor_horario', JSON.stringify(this.adminHorario));
                if (FB.activo) { try { await fbSet('colsabor/horario', this.adminHorario); } catch (e) {} }
                this.actualizarTextoHorario();
                this.actualizarEstado();
                this.mostrarToast('Horario guardado');
            },
            actualizarEstado() {
                const ahora = new Date();
                const dia = ahora.getDay();
                const hora = ahora.getHours() + ahora.getMinutes() / 60;
                const dias = String(this.adminHorario.dias || '').split(',').map(Number);
                const inicio = this.adminHorario.inicio;
                const fin = this.adminHorario.fin;
                let abierto = false;
                if (dias.includes(dia)) {
                    if (fin < inicio) {
                        if (hora >= inicio && hora < 24) abierto = true;
                        else if (hora >= 0 && hora < fin) abierto = true;
                    } else {
                        if (hora >= inicio && hora < fin) abierto = true;
                    }
                }
                this.isOpen = abierto;
            },

            // ── QR / compartir / contacto ──
            abrirQR() {
                const img = document.getElementById('qrImgModal');
                if (img) {
                    const url = NEGOCIO.url || window.location.href;
                    img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=1B5E20&bgcolor=ffffff&data=' + encodeURIComponent(url);
                    img.onerror = () => { img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent('https://wa.me/' + NEGOCIO.whatsapp); };
                }
                this.qrModalOpen = true;
            },
            copiarEnlace() {
                const url = NEGOCIO.url || window.location.href;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url)
                        .then(() => this.mostrarToast('✅ Enlace copiado'))
                        .catch(() => this.mostrarToast('Enlace: ' + url));
                } else {
                    this.mostrarToast('Enlace: ' + url);
                }
            },
            shareCard() {
                const url = NEGOCIO.url || window.location.href;
                if (navigator.share) {
                    navigator.share({ title: 'Colsabor · Comida sana', text: '¡Pide tu comida favorita! 🍽️', url: url }).catch(() => {});
                } else {
                    this.copiarEnlace();
                }
            },
            saveContact() {
                const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:Colsabor Comida Sana\nORG:Colsabor\nTEL;TYPE=CELL:+57' + NEGOCIO.telefono + '\nADR:;;' + NEGOCIO.ubicacion + ';;;Colombia\nURL:' + (NEGOCIO.url || window.location.href) + '\nEND:VCARD';
                const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Colsabor.vcf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(link.href), 1200);
            },

            // ── Admin: catálogo ──
            async toggleAgotado(p) {
                p.agotado = !p.agotado;
                await this.guardarProducto(p);
                this.mostrarToast(p.agotado ? '🙈 Producto ocultado del menú' : '👁️ Producto visible en el menú');
            },
            async deleteProduct(id) {
                if (!confirm('¿Eliminar este producto?')) return;
                this.productos = this.productos.filter(p => p.id !== id);
                localStorage.setItem('colsabor_productos_v2', JSON.stringify(this.productos));
                if (FB.activo) { try { await fbDel('colsabor/productos/' + id); } catch (e) {} }
                this.mostrarToast('🗑️ Producto eliminado');
            },
            async addProduct() {
                if (!this.newProduct.nombre) { this.mostrarToast('El nombre es obligatorio'); return; }
                const id = idDesdeNombre(this.newProduct.nombre) + '-' + Math.random().toString(36).substr(2, 4);
                const nuevo = {
                    id: id,
                    nombre: this.newProduct.nombre.trim(),
                    precio: parseInt(this.newProduct.precio) || 0,
                    categoria: this.newProduct.categoria,
                    imagen: this.newProduct.imagen || '🍽️',
                    categorias: [],
                    etiquetas: [],
                    tiempo: 0,
                    destacado: false,
                    agotado: false
                };
                this.productos.push(nuevo);
                this.newProduct = { nombre: '', precio: '', imagen: '', categoria: CATEGORIAS[0] };
                await this.guardarProducto(nuevo);
                this.mostrarToast('✅ Producto agregado' + (FB.activo ? ' y guardado en Firebase' : ''));
            },
            actualizarCampoProducto(p, campo, valor) { p[campo] = valor; this.sincronizarProducto(p); },
            // Categorías adicionales (ej: un plato que va en Almuerzos y Comidas)
            async actualizarCategoriasExtra(p, texto) {
                const lista = String(texto || '').split(',')
                    .map(s => s.trim())
                    .filter(s => s && s !== p.categoria && this.categorias.includes(s));
                p.categorias = lista;
                await this.guardarProducto(p);
                this.mostrarToast('✅ Categorías actualizadas');
            },
            async guardarPrecio(p) {
                const nuevo = parseInt(p.precio_editable);
                if (isNaN(nuevo) || nuevo < 0) { this.mostrarToast('⚠️ Precio inválido'); return; }
                p.precio = nuevo;
                await this.guardarProducto(p);
                this.mostrarToast('✅ Precio guardado');
            },

            // ── Admin: sesión y utilidades ──
            loginAdmin() {
                if (this.adminPassword === ADMIN_PIN) {
                    this.adminAuthenticated = true;
                    this.adminPassword = '';
                    this.mostrarToast('🔓 Sesión iniciada');
                } else {
                    this.adminPassword = '';
                    this.mostrarToast('⚠️ PIN incorrecto');
                }
            },
            logoutAdmin() {
                this.adminAuthenticated = false;
                this.adminMode = false;
                this.mostrarToast('🔒 Panel cerrado');
            },
            totalAgotados() { return this.productos.filter(p => p.agotado).length; },
            async guardarPromo() {
                localStorage.setItem('colsabor_promo', this.promoText);
                if (FB.activo) { try { await fbSet('colsabor/promo', this.promoText); } catch (e) {} }
                this.mostrarToast('💾 Promoción guardada');
            },
            async restablecerMenu() {
                if (!confirm('¿Restaurar el menú original? Se pierden los cambios locales.')) return;
                this.productos = copiaInicial();
                await this.persistirProductos();
                this.mostrarToast('↩️ Menú restaurado');
            },
            exportarMenu() {
                const texto = JSON.stringify(this.productos, null, 2);
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(texto)
                        .then(() => this.mostrarToast('📋 JSON copiado al portapapeles'))
                        .catch(() => this.mostrarToast('No se pudo copiar'));
                } else {
                    this.mostrarToast('Portapapeles no disponible');
                }
            },
            tapLogo() { /* opcional */ },

            // ── PWA ──
            esInstalableAhora() { return !!deferredInstallPrompt; },
            instalarAhora() {
                if (!deferredInstallPrompt) {
                    this.mostrarToast('Usa el menú del navegador → "Instalar app"');
                    return;
                }
                deferredInstallPrompt.prompt();
                deferredInstallPrompt.userChoice.then((res) => {
                    if (res.outcome === 'accepted') {
                        this.installModalOpen = false;
                        this.mostrarToast('✅ ¡Colsabor instalada!');
                    }
                    deferredInstallPrompt = null;
                }).catch(() => { deferredInstallPrompt = null; });
            },

            mostrarToast(msg) {
                const el = document.getElementById('toast');
                if (!el) return;
                el.textContent = msg;
                el.classList.add('show');
                clearTimeout(this._toastTimeout);
                this._toastTimeout = setTimeout(() => el.classList.remove('show'), 3000);
            }
        };
    });
});

// ── Carrusel ──
function carouselData() {
    return {
        currentSlide: 0,
        touchStartX: 0,
        autoplayTimer: null,
        images: [
            // 2 fotos por categoría (tomadas de los productos reales)
            'assets/productos/papas-rellenas.jpg',
            'assets/productos/empanadas.jpg',
            'assets/productos/bandeja-paisa.jpg',
            'assets/productos/mojarra-roja.webp',
            'assets/productos/pechuga-plancha.jpg',
            'assets/productos/sierra-cojinua.jpg',
            'assets/productos/jugo-pina.jpg',
            'assets/productos/jugo-maracuya.jpg',
            'assets/productos/chocolate.jpg',
            'assets/productos/cafe-leche.jpg'
        ],
        init() { this.startAutoplay(); },
        startAutoplay() {
            this.stopAutoplay();
            this.autoplayTimer = setInterval(() => { this.nextSlide(); }, 3500);
        },
        stopAutoplay() { clearInterval(this.autoplayTimer); },
        goTo(idx) { this.currentSlide = idx; this.startAutoplay(); },
        prevSlide() {
            this.currentSlide = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1;
            this.startAutoplay();
        },
        nextSlide() {
            this.currentSlide = this.currentSlide === this.images.length - 1 ? 0 : this.currentSlide + 1;
        },
        touchStart(e) { this.stopAutoplay(); this.touchStartX = e.touches[0].clientX; },
        touchEnd(e) {
            const diff = this.touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { diff > 0 ? this.nextSlide() : this.prevSlide(); }
            this.startAutoplay();
        }
    };
}

// ── Posicionar botón WhatsApp flotante ──
function posicionarWA() {
    const card = document.querySelector('.card-container');
    const wa = document.querySelector('.wa-float-wrap');
    if (!card || !wa) return;
    const rect = card.getBoundingClientRect();
    wa.style.left = (rect.right - 72) + 'px';
    wa.style.right = 'auto';
}
window.addEventListener('resize', posicionarWA);
window.addEventListener('scroll', posicionarWA, { passive: true });
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(posicionarWA, 200);
    setTimeout(posicionarWA, 800);
});

// ── PWA: instalación ──
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
});
window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; });

// ── PWA: service worker ──
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./service-worker.js').catch(function (err) {
            console.warn('No se pudo registrar el service worker:', err);
        });
    });
}
