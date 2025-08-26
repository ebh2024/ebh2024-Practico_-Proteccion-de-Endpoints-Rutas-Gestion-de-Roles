import axios from 'axios';

// Crea una instancia de Axios con una URL base predefinida para la API.
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor de solicitudes de Axios.
// Se ejecuta antes de que cada solicitud sea enviada.
api.interceptors.request.use(
  (config) => {
    // Obtiene el token de autenticación del almacenamiento de sesión.
    const token = sessionStorage.getItem('token');
    // Si existe un token, lo añade al encabezado de autorización de la solicitud.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Si hay un error en la solicitud, lo rechaza.
    return Promise.reject(error);
  }
);

export default api;
