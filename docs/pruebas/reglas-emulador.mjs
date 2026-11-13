/* KZ-MENUS-008 - Prueba de reglas y autorizacion de Colsabor con los emuladores.

   QUE COMPRUEBA (con peticiones REST reales contra los emuladores):
     - administrador con _admin/<uid> = { activo:true, negocio:'colsabor' } -> escribe
     - cuenta de otro negocio, cuenta inactiva, cuenta sin ficha y anonimo -> DENEGADOS
     - _admin no se puede escribir desde el cliente (nadie se autoriza solo)
     - escrituras publicas: crear pedido y resena SI; modificar lo creado NO
     - compatibilidad con El Titi, que comparte las mismas reglas (menu/)
     - el administrador lee pedidos_privados; el anonimo no

   REQUISITOS (ninguno es productivo):
     - firebase-tools instalado (v15 probado)
     - un JRE en el PATH. Se probo con el que trae Android Studio:
         "C:\Program Files\Android\Android Studio\jbr\bin"
       Anadirlo SOLO al PATH de esa consola, nunca al del sistema.
     - database.rules.v5b.json copiado como database.rules.json junto a firebase.json
     - proyecto demo (demo-kz007): sin credenciales ni datos reales

   COMO EJECUTAR (desde la carpeta que tenga firebase.json):
     firebase emulators:exec --only auth,database --project demo-kz007 ^
       "node ../docs/pruebas/reglas-emulador.mjs"

   No escribe nada en produccion: los emuladores se apagan al terminar.
*/
/* KZ-MENUS-008 · prueba de reglas y autorización de Colsabor contra los emuladores.
   Se ejecuta DENTRO de `firebase emulators:exec`, así que los emuladores ya están
   levantados. Proyecto demo, datos inventados, cero credenciales productivas.

   Comprueba, con peticiones REST reales:
     · administrador con activo=true y negocio=colsabor  -> escribe
     · usuario sin ficha _admin                          -> denegado
     · usuario de otro negocio (titi) escribiendo en colsabor -> denegado
     · usuario inactivo                                   -> denegado
     · anónimo                                            -> denegado
     · escrituras públicas (crear pedido/reseña)          -> permitidas solo al crear
     · compatibilidad con el otro negocio que comparte reglas (menu/titi)
     · _admin no se puede escribir desde un cliente
*/

const DB = 'http://127.0.0.1:9100';
const AUTH = 'http://127.0.0.1:9199/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key';
const NS = process.env.KZ_NS || 'demo-kz007-default-rtdb';

let fallos = 0;
const check = (ok, nombre, detalle) => {
  if (!ok) fallos++;
  console.log(`  ${ok ? 'OK  ' : 'FALLA'} · ${nombre}${detalle !== undefined && detalle !== '' ? '  →  ' + detalle : ''}`);
};

async function crearUsuario(etiqueta) {
  const email = `kz-${etiqueta}-${Date.now()}@prueba.local`;
  const r = await fetch(AUTH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'pass12345', returnSecureToken: true }),
  });
  const j = await r.json();
  if (!j.localId) throw new Error('no se pudo crear el usuario ' + etiqueta + ': ' + JSON.stringify(j).slice(0, 120));
  return { email, uid: j.localId, token: j.idToken };
}

/* el emulador acepta access_token=owner como administrador: así se siembra _admin */
async function sembrar(ruta, valor) {
  const r = await fetch(`${DB}/${ruta}.json?ns=${NS}&access_token=owner`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valor),
  });
  return { status: r.status, texto: (await r.text()).slice(0, 80) };
}

function url(ruta, token) {
  return `${DB}/${ruta}.json?ns=${NS}` + (token ? `&auth=${encodeURIComponent(token)}` : '');
}

async function escribir(ruta, valor, token) {
  const r = await fetch(url(ruta, token), {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valor),
  });
  return { status: r.status, texto: (await r.text()).slice(0, 100) };
}

async function parchear(ruta, valor, token) {
  const r = await fetch(url(ruta, token), {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valor),
  });
  return { status: r.status, texto: (await r.text()).slice(0, 100) };
}

async function leer(ruta, token) {
  const r = await fetch(url(ruta, token));
  return { status: r.status, texto: (await r.text()).slice(0, 100) };
}

const permitido = (r) => r.status === 200;
const denegado = (r) => r.status === 401 || r.status === 403;

console.log('\n═══ 1 · PREPARAR USUARIOS EN EL EMULADOR ═══');
const adminCol = await crearUsuario('admin-colsabor');
const adminTiti = await crearUsuario('admin-titi');
const inactivo = await crearUsuario('inactivo');
const sinRol = await crearUsuario('sin-rol');
console.log(`  creados: admin-col ${adminCol.uid.slice(0, 8)}… · admin-titi ${adminTiti.uid.slice(0, 8)}… · inactivo ${inactivo.uid.slice(0, 8)}… · sin-rol ${sinRol.uid.slice(0, 8)}…`);

const s1 = await sembrar('_admin/' + adminCol.uid, { activo: true, negocio: 'colsabor' });
const s2 = await sembrar('_admin/' + adminTiti.uid, { activo: true, negocio: 'titi' });
const s3 = await sembrar('_admin/' + inactivo.uid, { activo: false, negocio: 'colsabor' });
check(permitido(s1) && permitido(s2) && permitido(s3), 'se siembran las fichas _admin con el emulador', `status ${s1.status}/${s2.status}/${s3.status}`);

console.log('\n═══ 2 · QUIÉN PUEDE ADMINISTRAR COLSABOR ═══');
const wCol = (t) => escribir('colsabor/productos/prueba-kz', { nombre: 'Producto de prueba', precio: 1000 }, t);

const rAdmin = await wCol(adminCol.token);
check(permitido(rAdmin), 'administrador activo de colsabor: AUTORIZADO', `HTTP ${rAdmin.status}`);

const rTiti = await wCol(adminTiti.token);
check(denegado(rTiti), 'cuenta activa de OTRO negocio: DENEGADA', `HTTP ${rTiti.status} ${rTiti.texto.slice(0, 40)}`);

const rInactivo = await wCol(inactivo.token);
check(denegado(rInactivo), 'cuenta inactiva (activo=false): DENEGADA', `HTTP ${rInactivo.status}`);

const rSinRol = await wCol(sinRol.token);
check(denegado(rSinRol), 'cuenta sin ficha _admin: DENEGADA', `HTTP ${rSinRol.status}`);

const rAnon = await wCol(null);
check(denegado(rAnon), 'usuario anónimo: DENEGADO', `HTTP ${rAnon.status}`);

console.log('\n═══ 3 · NODO _admin: NADIE SE AUTORIZA SOLO ═══');
const rAuto = await escribir('_admin/' + sinRol.uid, { activo: true, negocio: 'colsabor' }, sinRol.token);
check(denegado(rAuto), 'un usuario no puede escribirse su propia ficha', `HTTP ${rAuto.status}`);
const rAutoAdmin = await escribir('_admin/' + adminCol.uid + '/activo', true, adminCol.token);
check(denegado(rAutoAdmin), 'ni siquiera un admin activo puede tocar _admin desde el cliente', `HTTP ${rAutoAdmin.status}`);
const rLeerPropia = await leer('_admin/' + adminCol.uid, adminCol.token);
check(permitido(rLeerPropia), 'cada cuenta sí puede leer su propia ficha', `HTTP ${rLeerPropia.status}`);
const rLeerAjena = await leer('_admin/' + adminTiti.uid, adminCol.token);
check(denegado(rLeerAjena), 'no puede leer la ficha de otra cuenta', `HTTP ${rLeerAjena.status}`);

console.log('\n═══ 4 · ESCRITURAS PÚBLICAS (el cliente que pide) ═══');
const idPedido = 'pedido-prueba-1';
const rCrearPedido = await escribir('colsabor/pedidos/' + idPedido, { codigoConsulta: 'ABC123', estado: 'COTIZACION_PENDIENTE' }, null);
check(permitido(rCrearPedido), 'un anónimo puede CREAR su pedido', `HTTP ${rCrearPedido.status}`);
const rModificarPedido = await parchear('colsabor/pedidos/' + idPedido, { estado: 'CONFIRMADO' }, null);
check(denegado(rModificarPedido), 'pero NO puede modificar un pedido ya creado', `HTTP ${rModificarPedido.status}`);
const rCrearResena = await escribir('colsabor/reseñas/resena-1', { texto: 'Muy rico', estrellas: 5 }, null);
check(permitido(rCrearResena), 'un anónimo puede CREAR una reseña', `HTTP ${rCrearResena.status}`);

console.log('\n═══ 5 · COMPATIBILIDAD CON EL OTRO NEGOCIO QUE COMPARTE REGLAS ═══');
const rMenuAnon = await leer('menu/productos', null);
check(permitido(rMenuAnon), 'menu/productos es de lectura pública (El Titi)', `HTTP ${rMenuAnon.status}`);
const rMenuTiti = await escribir('menu/productos/prueba-kz', { nombre: 'Producto Titi', precio: 2000 }, adminTiti.token);
check(permitido(rMenuTiti), 'el admin de titi SÍ escribe en menu/ (El Titi)', `HTTP ${rMenuTiti.status}`);
const rMenuCol = await escribir('menu/productos/prueba-kz2', { nombre: 'X', precio: 1 }, adminCol.token);
check(denegado(rMenuCol), 'el admin de colsabor NO escribe en menu/ (El Titi)', `HTTP ${rMenuCol.status}`);
const rColTiti = await escribir('colsabor/productos/prueba-kz2', { nombre: 'X', precio: 1 }, adminTiti.token);
check(denegado(rColTiti), 'y al revés: el admin de titi NO escribe en colsabor/', `HTTP ${rColTiti.status}`);

console.log('\n═══ 6 · EL ADMINISTRADOR SÍ LEE LO QUE NECESITA EL PANEL ═══');
const rPanel = await leer('colsabor/pedidos_privados', adminCol.token);
check(rPanel.status === 200, 'admin de colsabor puede leer pedidos_privados', `HTTP ${rPanel.status}`);
const rPanelAnon = await leer('colsabor/pedidos_privados', null);
check(denegado(rPanelAnon), 'un anónimo NO puede leer pedidos_privados', `HTTP ${rPanelAnon.status}`);

console.log(`\n═══════════════════════════════════════\nreglas de Colsabor · ${fallos === 0 ? 'TODO OK' : fallos + ' fallo(s)'}`);
process.exit(fallos === 0 ? 0 : 1);
