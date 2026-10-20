/* =========================================
   AkademiaUniversalis — Autenticación
   Fase 2: Sistema de auth del lado del cliente
   ========================================= */

const AUTH_KEY = 'au_auth';
const USERS_KEY = 'au_users';

// Estado de autenticación
let currentUser = null;

// Inicializar usuarios por defecto si no existen
function initDefaultUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    const defaultUsers = [
      {
        id: 'u_001',
        email: 'estudiante@demo.com',
        password: 'demo1234',
        nombre: 'Estudiante Demo',
        rol: 'estudiante',
        creado: new Date().toISOString()
      },
      {
        id: 'u_002',
        email: 'profesor@demo.com',
        password: 'demo1234',
        nombre: 'Profesor Demo',
        rol: 'profesor',
        creado: new Date().toISOString()
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
}

// Registrar usuario
function register(nombre, email, password, rol) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Este correo ya está registrado' };
  }
  const user = {
    id: 'u_' + Date.now(),
    email,
    password, // En producción esto iría hasheado en el servidor
    nombre,
    rol,
    creado: new Date().toISOString()
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, user };
}

// Iniciar sesión
function login(email, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, error: 'Correo o contraseña incorrectos' };
  }
  currentUser = {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
  return { success: true, user: currentUser };
}

// Cerrar sesión
function logout() {
  currentUser = null;
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'index.html';
}

// Obtener usuario actual
function getCurrentUser() {
  if (currentUser) return currentUser;
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }
  return null;
}

// Verificar si está autenticado
function isAuthenticated() {
  return !!getCurrentUser();
}

// Proteger rutas que requieren auth
function requireAuth(allowedRoles = null) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'auth.html?next=' + encodeURIComponent(window.location.pathname);
    return false;
  }
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    alert('No tienes permisos para acceder a esta página.');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Inicializar
initDefaultUsers();

// Exportar para uso en otras páginas
window.AkademiaAuth = {
  login, register, logout, getCurrentUser, isAuthenticated, requireAuth, currentUser
};