import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Badge } from 'primereact/badge';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

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

  const start = (
    <div className="flex align-items-center">
      <Link to="/" className="p-menubar-start-logo" style={{ textDecoration: 'none', color: 'var(--facebook-blue)', fontSize: '1.5rem', fontWeight: 'bold', marginRight: '16px' }}>
        My App
      </Link>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText placeholder="Search App" className="p-inputtext-sm" style={{ borderRadius: '20px', paddingLeft: '2.5rem', backgroundColor: 'var(--facebook-gray-bg)', border: 'none' }} />
      </span>
    </div>
  );

  const centerItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    ...(user ? [
      {
        label: 'Products',
        icon: 'pi pi-shopping-cart',
        command: () => navigate('/products')
      },
      {
        label: 'Users',
        icon: 'pi pi-users',
        command: () => navigate('/users')
      }
    ] : [])
  ];

  const end = (
    <div className="flex align-items-center">
      {user ? (
        <>
          <span className="mr-2" style={{ color: '#1c1e21', fontWeight: '600' }}>{user.name}</span>
          <Badge value={user.role} severity={user.role === 'admin' ? 'danger' : user.role === 'moderator' ? 'warning' : 'info'} style={{ marginRight: '8px' }} />
          <Button onClick={handleLogout} className="p-button p-button-secondary" label="Logout" />
        </>
      ) : (
        <>
          <Button onClick={() => navigate('/login')} className="p-button p-button-primary mr-2" label="Login" />
          <Button onClick={() => navigate('/register')} className="p-button p-button-secondary" label="Register" />
        </>
      )}
    </div>
  );

  return (
    <Menubar model={centerItems} start={start} end={end} />
  );
};

export default Navbar;
