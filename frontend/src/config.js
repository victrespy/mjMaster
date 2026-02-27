// Detectar si estamos en localhost o en un dominio externo (como ngrok)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Usamos rutas relativas para que funcione tanto en localhost como en ngrok
export const API_URL = "/api";

// Exportamos el origen actual para las imágenes
export const API_BASE_URL = window.location.origin;
