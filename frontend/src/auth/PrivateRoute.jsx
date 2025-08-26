import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * Componente de ruta privada.
 * Protege rutas que requieren autenticación. Si no hay token o es inválido,
 * redirige al usuario a la página de inicio de sesión.
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos a renderizar si el usuario está autenticado.
 */
const PrivateRoute = ({ children }) => {
  // Obtiene el token de sesión del almacenamiento local
  const token = sessionStorage.getItem('token');

  // Si no hay token, redirige a la página de inicio de sesión
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    // Intenta decodificar el token para verificar su validez
    jwtDecode(token);
  } catch {
    // Si el token es inválido (ej. expirado o malformado), redirige a la página de inicio de sesión
    return <Navigate to="/login" />;
  }

  // Si el token es válido, renderiza los componentes hijos
  return children;
};

export default PrivateRoute;
