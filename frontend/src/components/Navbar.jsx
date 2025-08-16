import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Badge } from 'primereact/badge';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar flex justify-content-between align-items-center">
      <div className="flex align-items-center">
        <Link to="/" className="navbar-brand">Mi App</Link>
        <ul className="navbar-nav flex align-items-center">
          <li className="navbar-item"><Link to="/" className="navbar-link">Inicio</Link></li>
          {user && <li className="navbar-item"><Link to="/products" className="navbar-link">Productos</Link></li>}
          {user && <li className="navbar-item"><Link to="/users" className="navbar-link">Usuarios</Link></li>}
        </ul>
      </div>
      <div className="flex align-items-center">
        <ul className="navbar-nav flex align-items-center">
          {user ? (
            <>
              <li className="navbar-item user-info">
                <span>{user.name} </span>
                <Badge value={user.role} severity={user.role === 'admin' ? 'danger' : user.role === 'moderator' ? 'warning' : 'info'}></Badge>
              </li>
              <li className="navbar-item"><button onClick={handleLogout} className="navbar-link navbar-button">Logout</button></li>
            </>
          ) : (
            <>
              <li className="navbar-item"><Link to="/login" className="navbar-link">Login</Link></li>
              <li className="navbar-item"><Link to="/register" className="navbar-link">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
