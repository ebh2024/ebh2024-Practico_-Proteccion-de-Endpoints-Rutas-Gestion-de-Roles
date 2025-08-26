import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * Componente de ruta pública.
 * Permite el acceso a rutas públicas. Si el usuario ya está autenticado con un token válido,
 * lo redirige a la página de productos para evitar que acceda a rutas como login/register.
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos a renderizar.
 */
const PublicRoute = ({ children }) => {
  // Obtiene el token de sesión del almacenamiento local
  const token = sessionStorage.getItem('token');

  // Si hay un token, intenta decodificarlo
  if (token) {
    try {
      // Si el token es válido, redirige a la página de productos
      jwtDecode(token);
      return <Navigate to="/products" />;
    } catch {
      // Si el token es inválido, permite el acceso a la ruta pública
      return children;
    }
  }

  // Si no hay token, permite el acceso a la ruta pública
  return children;
};

export default PublicRoute;
