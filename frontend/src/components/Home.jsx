import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

/**
 * Componente de la página de inicio (Home).
 * Redirige a la página de productos si el usuario está autenticado,
 * de lo contrario, muestra opciones para iniciar sesión o registrarse.
 */
const Home = () => {
  // Obtiene el token de sesión del almacenamiento local
  const token = sessionStorage.getItem('token');

  // Si hay un token, intenta decodificarlo y redirige a /products
  if (token) {
    try {
      jwtDecode(token);
      return <Navigate to="/products" />;
    } catch (error) {
      // Si el token es inválido, lo elimina y redirige a /login
      console.error("Token inválido:", error);
      sessionStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  }

  return (
    <div className="home-container flex justify-content-center align-items-center">
      <Card title="¡Bienvenido a Mi Aplicación!" className="home-card w-full max-w-600 text-center">
        <p className="mb-4">Gestiona tus productos y usuarios de forma eficiente en esta aplicación.</p>
        <div className="flex justify-content-center gap-2">
          <Link to="/login">
            <Button label="Iniciar Sesión" className="p-button-primary" />
          </Link>
          <Link to="/register">
            <Button label="Registrarse" className="p-button-secondary" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
