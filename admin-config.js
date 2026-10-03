// Configuración del panel de administración — COLSABOR
// NOTA: usa el proyecto Firebase compartido `el-titi-menu` (Opción A).
//       Cambia `ruta` a 'colsabor' para separar los datos de El Titi (/menu/).
window.ADMIN_CONFIG = {
  nombre: 'Colsabor',
  ruta: 'colsabor',        // namespace en RTDB/Storage
  color: '#2E7D32',
  categorias: ['Desayunos', 'Almuerzos', 'Jugos', 'Bebidas'],
  cloudinary: {
    cloudName: 'f07x0wga',
    uploadPreset: 'menu-digital'
  },
  firebase: {
    apiKey: "AIzaSyDHWE3OJMspi_z0CKPv8mjvjI7igum98rs",
    authDomain: "el-titi-menu.firebaseapp.com",
    databaseURL: "https://el-titi-menu-default-rtdb.firebaseio.com",
    projectId: "el-titi-menu",
    storageBucket: "el-titi-menu.firebasestorage.app",
    messagingSenderId: "903648110789",
    appId: "1:903648110789:web:6ac58748862dfeb5a568ac"
  }
};
