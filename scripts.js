// ── Configuración ──
    const CATEGORIAS = ['Desayunos', 'Almuerzos', 'Carnes', 'Pescados', 'Sopas', 'Acompañamientos', 'Bebidas'];
    const ADMIN_PIN = '1234'; // PIN del panel admin — cámbialo aquí.
    const EMOJIS_CATEGORIA = {
        'Desayunos': '🍳',
        'Almuerzos': '🍛',
        'Carnes': '🥩',
        'Pescados': '🐟',
        'Sopas': '🥣',
        'Acompañamientos': '🍟',
        'Bebidas': '🥤'
    };

    // ── Utilidad: ¿la "imagen" de un producto es un emoji o una ruta de archivo? ──
    function esImagenEmoji(valor) {
        if (typeof valor !== 'string' || !valor) return false;
        if (valor.length > 16) return false;
        if (valor.includes('/') || valor.includes('\\')) return false;
        if (/\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)$/i.test(valor)) return false;
        return true;
    }

    // ── Productos (extraídos de los servicios de Colsabor) ──
    const productosIniciales = [
        // Desayunos
        { id: 'col-papas-rellenas', nombre: 'Papas rellenas', precio: 4000, categoria: 'Desayunos', imagen: '🥔', agotado: false },
        { id: 'col-empanadas', nombre: 'Empanadas', precio: 3000, categoria: 'Desayunos', imagen: '🥟', agotado: false },
        { id: 'col-arepas-huevo', nombre: 'Arepas de huevo', precio: 4500, categoria: 'Desayunos', imagen: '🌽', agotado: false },
        { id: 'col-desayuno-mixto', nombre: 'Desayuno mixto', precio: 8000, categoria: 'Desayunos', imagen: '🍳', agotado: false },
        // Almuerzos
        { id: 'col-almuerzo-ejecutivo', nombre: 'Almuerzo ejecutivo', precio: 12000, categoria: 'Almuerzos', imagen: '🍛', agotado: false },
        { id: 'col-arroz-coco-frito', nombre: 'Arroz de coco frito', precio: 9000, categoria: 'Almuerzos', imagen: '🍚', agotado: false },
        // Carnes
        { id: 'col-pechuga-plancha', nombre: 'Pechuga a la plancha', precio: 14000, categoria: 'Carnes', imagen: '🍗', agotado: false },
        { id: 'col-carne-res', nombre: 'Carne de res', precio: 15000, categoria: 'Carnes', imagen: '🥩', agotado: false },
        { id: 'col-carne-cerdo', nombre: 'Carne de cerdo', precio: 14000, categoria: 'Carnes', imagen: '🥓', agotado: false },
        { id: 'col-higado-encebollado', nombre: 'Hígado encebollado', precio: 12000, categoria: 'Carnes', imagen: '🧅', agotado: false },
        { id: 'col-carne-bistec', nombre: 'Carne en bistec', precio: 13000, categoria: 'Carnes', imagen: '🥩', agotado: false },
        { id: 'col-carne-desmechada', nombre: 'Carne desmechada', precio: 13000, categoria: 'Carnes', imagen: '🥩', agotado: false },
        // Pescados
        { id: 'col-mojarra-roja', nombre: 'Mojarra roja', precio: 18000, categoria: 'Pescados', imagen: '🐟', agotado: false },
        { id: 'col-sierra-cojinua', nombre: 'Sierra cojinua', precio: 17000, categoria: 'Pescados', imagen: '🐠', agotado: false },
        { id: 'col-pescado-zumo-coco', nombre: 'Pescado en zumo de coco', precio: 19000, categoria: 'Pescados', imagen: '🥥', agotado: false },
        // Sopas
        { id: 'col-sopa-pescado', nombre: 'Sopa de pescado', precio: 11000, categoria: 'Sopas', imagen: '🍲', agotado: false },
        { id: 'col-sopa-mondongo', nombre: 'Sopa de mondongo', precio: 10000, categoria: 'Sopas', imagen: '🍲', agotado: false },
        { id: 'col-sancocho-gallina', nombre: 'Sancocho de gallina', precio: 13000, categoria: 'Sopas', imagen: '🍗', agotado: false },
        { id: 'col-sancocho-costilla', nombre: 'Sancocho de costilla', precio: 14000, categoria: 'Sopas', imagen: '🥩', agotado: false },
        // Acompañamientos
        { id: 'col-yuca-chicharron', nombre: 'Yuca con chicharrón', precio: 7000, categoria: 'Acompañamientos', imagen: '🍠', agotado: false },
        { id: 'col-patacon-queso', nombre: 'Patacón con queso', precio: 5000, categoria: 'Acompañamientos', imagen: '🧀', agotado: false },
        { id: 'col-patacon-huevos', nombre: 'Patacón con huevos', precio: 6000, categoria: 'Acompañamientos', imagen: '🍳', agotado: false },
        { id: 'col-bandeja-paisa', nombre: 'Bandeja paisa', precio: 22000, categoria: 'Acompañamientos', imagen: '🥘', agotado: false },
        // Bebidas
        { id: 'col-jugos-naturales', nombre: 'Jugos naturales', precio: 4000, categoria: 'Bebidas', imagen: '🥤', agotado: false },
        { id: 'col-chocolate', nombre: 'Chocolate', precio: 3500, categoria: 'Bebidas', imagen: '☕', agotado: false },
        { id: 'col-cafe-leche', nombre: 'Café con leche', precio: 3000, categoria: 'Bebidas', imagen: '☕', agotado: false },
        { id: 'col-arroz-coco', nombre: 'Arroz de coco (bebida)', precio: 3000, categoria: 'Bebidas', imagen: '🥛', agotado: false }
    ];

    // ── Estado global (Alpine) ──
    document.addEventListener('alpine:init', () => {
        Alpine.data('appData', function() {
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
                telefono: '3042009142',
                ubicacion: 'El Porvenir',

                // Getters
                get productosFiltrados() {
                    const q = this.busqueda.trim().toLowerCase();
                    if (!q) return this.productos;
                    return this.productos.filter(p => p.nombre.toLowerCase().includes(q));
                },
                get categoriasConProductos() {
                    return this.categorias.map(cat => {
                        const productos = this.productosFiltrados.filter(p => p.categoria === cat);
                        return { nombre: cat, emoji: this.emojisCategoria[cat] || '🍽️', productos, count: productos.length };
                    });
                },
                get totalItems() { return this.carrito.reduce((s, i) => s + i.cantidad, 0); },
                get totalPrecio() { return this.carrito.reduce((s, i) => s + i.precio * i.cantidad, 0); },
                get promedioEstrellas() {
                    if (!this.reseñas.length) return 0;
                    return (this.reseñas.reduce((s, r) => s + (r.estrellas || 0), 0) / this.reseñas.length).toFixed(1);
                },

                // Inicialización
                initApp() {
                    // Cargar productos desde localStorage o usar los iniciales
                    const stored = localStorage.getItem('colsabor_productos');
                    if (stored) {
                        try { this.productos = JSON.parse(stored); }
                        catch (e) { this.productos = JSON.parse(JSON.stringify(productosIniciales)); }
                    } else {
                        this.productos = JSON.parse(JSON.stringify(productosIniciales));
                        localStorage.setItem('colsabor_productos', JSON.stringify(this.productos));
                    }

                    // Cargar reseñas desde localStorage
                    const rev = localStorage.getItem('colsabor_reseñas');
                    if (rev) { try { this.reseñas = JSON.parse(rev); } catch(e) {} }

                    // Cargar horario
                    const hor = localStorage.getItem('colsabor_horario');
                    if (hor) { try { this.adminHorario = JSON.parse(hor); this.actualizarTextoHorario(); } catch(e) {} }

                    // Cargar promo
                    const prom = localStorage.getItem('colsabor_promo');
                    if (prom) this.promoText = prom;

                    // Estado de apertura (siempre abierto por defecto)
                    this.actualizarEstado();
                    setInterval(() => this.actualizarEstado(), 60000);

                    // Limpiar autofill del campo nombre de reseña
                    setTimeout(() => {
                        document.querySelector('.review-form input[type="text"]')?.removeAttribute('readonly');
                    }, 500);
                },

                // ── Productos ──
                agregarAlCarrito(p) {
                    const idx = this.carrito.findIndex(i => i.id === p.id);
                    if (idx >= 0) { this.carrito[idx].cantidad++; }
                    else { this.carrito.push({ id: p.id, nombre: p.nombre, precio: p.precio, emoji: esImagenEmoji(p.imagen) ? p.imagen : '🍽️', cantidad: 1 }); }
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
                    let msg = '🍽️ *PEDIDO - Colsabor · Comida sana*\n━━━━━━━━━━━━━━━━━━━━\n';
                    this.carrito.forEach(i => {
                        msg += i.emoji + ' *' + i.nombre + '*\n   Cantidad: ' + i.cantidad + '\n   Precio: $' + (i.precio * i.cantidad).toLocaleString('es-CO') + '\n\n';
                    });
                    msg += '━━━━━━━━━━━━━━━━━━━━\n💰 *TOTAL: $' + this.totalPrecio.toLocaleString('es-CO') + '*\n\n📍 Por favor confirma tu dirección.';
                    window.location.href = 'whatsapp://send?phone=57' + this.telefono + '&text=' + encodeURIComponent(msg);
                    this.carritoOpen = false;
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
                    const dias = this.adminHorario.dias.split(',').map(Number);
                    let nombres = dias.map(d => {
                        if (d === 0) return 'Domingo';
                        if (d === 1) return 'Lunes';
                        if (d === 2) return 'Martes';
                        if (d === 3) return 'Miércoles';
                        if (d === 4) return 'Jueves';
                        if (d === 5) return 'Viernes';
                        if (d === 6) return 'Sábado';
                        return '';
                    });
                    const inicio = this.adminHorario.inicio;
                    const fin = this.adminHorario.fin;
                    const fmt = (h) => {
                        if (h === 0) return '12:00 AM';
                        if (h < 12) return h + ':00 AM';
                        if (h === 12) return '12:00 PM';
                        return (h - 12) + ':00 PM';
                    };
                    this.horarioTexto = nombres.join(' – ') + ' · ' + fmt(inicio) + ' a ' + fmt(fin);
                },
                guardarHorario() {
                    let dias = this.adminHorario.dias.split(',').map(Number).filter(d => !isNaN(d) && d >= 0 && d <= 6);
                    if (dias.length === 0) { this.mostrarToast('Debe ingresar al menos un día'); return; }
                    this.adminHorario.dias = dias.join(',');
                    localStorage.setItem('colsabor_horario', JSON.stringify(this.adminHorario));
                    this.actualizarTextoHorario();
                    this.actualizarEstado();
                    this.mostrarToast('Horario guardado');
                },
                actualizarEstado() {
                    const ahora = new Date();
                    const dia = ahora.getDay();
                    const hora = ahora.getHours() + ahora.getMinutes()/60;
                    const dias = this.adminHorario.dias.split(',').map(Number);
                    const inicio = this.adminHorario.inicio;
                    let fin = this.adminHorario.fin;
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

                // ── QR ──
                abrirQR() {
                    const img = document.getElementById('qrImgModal');
                    if (img) {
                        const url = window.location.href;
                        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=1B5E20&bgcolor=ffffff&data=${encodeURIComponent(url)}`;
                        img.onerror = () => { img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('https://wa.me/573042009142')}`; };
                    }
                    this.qrModalOpen = true;
                },
                copiarEnlace() {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url)
                        .then(() => this.mostrarToast('✅ Enlace copiado'))
                        .catch(() => this.mostrarToast('No se pudo copiar'));
                },
                shareCard() {
                    if (navigator.share) {
                        navigator.share({ title: 'Colsabor · Comida sana', text: '¡Pide tu comida favorita!', url: window.location.href });
                    } else {
                        this.mostrarToast('Comparte este enlace: ' + window.location.href);
                    }
                },
                saveContact() {
                    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:Colsabor Comida Sana\nTEL:${this.telefono}\nADR:El Porvenir\nURL:${window.location.href}\nEND:VCARD`;
                    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'Colsabor.vcf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                },

                // ── Admin (simplificado para demo) ──
                toggleAgotado(p) {
                    p.agotado = !p.agotado;
                    localStorage.setItem('colsabor_productos', JSON.stringify(this.productos));
                    this.mostrarToast(p.agotado ? '❌ Marcado AGOTADO' : '✅ Marcado DISPONIBLE');
                },
                deleteProduct(id) {
                    if (!confirm('¿Eliminar este producto?')) return;
                    this.productos = this.productos.filter(p => p.id !== id);
                    localStorage.setItem('colsabor_productos', JSON.stringify(this.productos));
                    this.mostrarToast('🗑️ Producto eliminado');
                },
                addProduct() {
                    if (!this.newProduct.nombre || !this.newProduct.precio) {
                        this.mostrarToast('Nombre y precio requeridos');
                        return;
                    }
                    const id = 'col-' + Date.now() + Math.random().toString(36).substr(2,4);
                    const nuevo = {
                        id,
                        nombre: this.newProduct.nombre.trim(),
                        precio: parseInt(this.newProduct.precio),
                        categoria: this.newProduct.categoria,
                        imagen: this.newProduct.imagen || '🍽️',
                        agotado: false
                    };
                    this.productos.push(nuevo);
                    localStorage.setItem('colsabor_productos', JSON.stringify(this.productos));
                    this.newProduct = { nombre: '', precio: '', imagen: '', categoria: CATEGORIAS[0] };
                    this.mostrarToast('✅ Producto agregado');
                },
                actualizarCampoProducto(p, campo, valor) {
                    p[campo] = valor;
                    localStorage.setItem('colsabor_productos', JSON.stringify(this.productos));
                },
                guardarPrecio(p) {
                    const nuevo = parseInt(p.precio_editable);
                    if (isNaN(nuevo) || nuevo <= 0) { this.mostrarToast('⚠️ Precio inválido'); return; }
                    p.precio = nuevo;
                    localStorage.setItem('colsabor_productos', JSON.stringify(this.productos));
                    this.mostrarToast('✅ Guardado');
                },

                // ── Utilidades ──
                tapLogo() { /* opcional */ },

                // ── PWA / Instalar app ──
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
                    }).catch(() => {
                        deferredInstallPrompt = null;
                    });
                },
                // ── Panel admin: sesión ──
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
                persistirProductos() { localStorage.setItem('colsabor_productos', JSON.stringify(this.productos)); },
                guardarPromo() {
                    localStorage.setItem('colsabor_promo', this.promoText);
                    this.mostrarToast('💾 Promoción guardada');
                },
                restablecerMenu() {
                    if (!confirm('¿Restaurar el menú original? Se perderán los cambios guardados en este dispositivo.')) return;
                    this.productos = JSON.parse(JSON.stringify(productosIniciales));
                    this.persistirProductos();
                    this.mostrarToast('↩️ Menú restaurado');
                },
                exportarMenu() {
                    const texto = JSON.stringify(this.productos, null, 2);
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(texto)
                            .then(() => this.mostrarToast('📋 JSON copiado al portapapeles'))
                            .catch(() => this.mostrarToast('No se pudo copiar'));
                    } else {
                        this.mostrarToast('Portapapeles no disponible en este navegador');
                    }
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
                'assets/galeria/foto1.webp',
                'assets/galeria/foto2.webp',
                'assets/galeria/foto3.webp'
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

    // ── Posicionar botón WhatsApp ──
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
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(posicionarWA, 200);
        setTimeout(posicionarWA, 800);
    });

    // ── PWA: captura del evento de instalación ──
    let deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
    });
    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
    });

    // ── PWA: registro del service worker (offline / instalable) ──
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./service-worker.js').catch(function (err) {
                console.warn('No se pudo registrar el service worker:', err);
            });
        });
    }
