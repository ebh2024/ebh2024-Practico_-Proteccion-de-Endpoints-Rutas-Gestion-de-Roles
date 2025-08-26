import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Badge } from 'primereact/badge';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

/**
 * Componente de la barra de navegación (Navbar).
 * Muestra enlaces de navegación, un campo de búsqueda, información del usuario
 * y botones de inicio de sesión/registro o cierre de sesión.
 */
const Navbar = () => {
  // Obtiene el token de sesión del almacenamiento local
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  let user = null;

  /**
   * Traduce el rol del usuario a español.
   * @param {string} role - El rol del usuario (ej. 'admin', 'moderator', 'user').
   * @returns {string} El rol traducido.
   */
  const translateRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'moderator':
        return 'Moderador';
      case 'user':
        return 'Usuario';
      default:
        return role;
    }
  };

  // Decodifica el token si existe para obtener la información del usuario
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      // Si el token es inválido, lo elimina y registra el error
      console.error("Token inválido:", error);
      sessionStorage.removeItem('token');
    }
  }

  /**
   * Maneja el cierre de sesión del usuario.
   * Elimina el token de sesión y redirige a la página de inicio de sesión.
   */
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // Contenido de la sección inicial de la barra de navegación (izquierda)
  const start = (
    <div className="flex align-items-center">
      <Link to="/" className="p-menubar-start-logo" style={{ textDecoration: 'none', color: 'var(--facebook-blue)', fontSize: '1.5rem', fontWeight: 'bold', marginRight: '16px' }}>
        Mi Aplicación
      </Link>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Buscar..." className="p-inputtext-sm" style={{ borderRadius: '20px', paddingLeft: '3.5rem', backgroundColor: 'var(--facebook-gray-bg)', border: 'none' }} />
      </span>
    </div>
  );

  // Elementos centrales de la barra de navegación
  const centerItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    // Muestra enlaces a Productos y Usuarios solo si el usuario está autenticado
    ...(user ? [
      {
        label: 'Productos',
        icon: 'pi pi-shopping-cart',
        command: () => navigate('/products')
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        command: () => navigate('/users')
      }
    ] : [])
  ];

  // Contenido de la sección final de la barra de navegación (derecha)
  const end = (
    <div className="flex align-items-center">
      {user ? (
        // Si el usuario está autenticado, muestra su nombre, rol y botón de cerrar sesión
        <>
          <span className="mr-2" style={{ color: '#1c1e21', fontWeight: '600' }}>{user.name}</span>
          <Badge value={translateRole(user.role)} severity={user.role === 'admin' ? 'danger' : user.role === 'moderator' ? 'warning' : 'info'} className="mr-2" />
          <Button onClick={handleLogout} className="p-button p-button-secondary" label="Cerrar Sesión" />
        </>
      ) : (
        // Si el usuario no está autenticado, muestra botones de iniciar sesión y registrarse
        <>
          <Button onClick={() => navigate('/login')} className="p-button p-button-primary mr-2" label="Iniciar Sesión" />
          <Button onClick={() => navigate('/register')} className="p-button p-button-secondary" label="Registrarse" />
        </>
      )}
    </div>
  );

  return (
    <Menubar model={centerItems} start={start} end={end} />
  );
};

export default Navbar;
