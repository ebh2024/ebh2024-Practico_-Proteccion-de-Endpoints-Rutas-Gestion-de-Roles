import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Badge } from 'primereact/badge';
import { Menubar } from 'primereact/menubar';

const Navbar = () => {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const items = [
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/')
    },
    ...(user ? [
      {
        label: 'Productos',
        icon: 'pi pi-fw pi-shopping-cart',
        command: () => navigate('/products')
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-users',
        command: () => navigate('/users')
      }
    ] : []),
    ...(!user ? [
      {
        label: 'Login',
        icon: 'pi pi-fw pi-sign-in',
        command: () => navigate('/login')
      },
      {
        label: 'Register',
        icon: 'pi pi-fw pi-user-plus',
        command: () => navigate('/register')
      }
    ] : [])
  ];

  const end = (
    <div className="flex align-items-center">
      {user && (
        <>
          <span className="mr-2">{user.name}</span>
          <Badge value={user.role} severity={user.role === 'admin' ? 'danger' : user.role === 'moderator' ? 'warning' : 'info'} />
          <button onClick={handleLogout} className="p-button p-button-danger ml-2">Logout</button>
        </>
      )}
    </div>
  );

  return (
    <Menubar model={items} end={end} />
  );
};

export default Navbar;