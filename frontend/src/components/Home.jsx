import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const Home = () => {
  const token = sessionStorage.getItem('token');

  if (token) {
    try {
      jwtDecode(token);
      return <Navigate to="/products" />;
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  }

  return (
    <div className="home-container flex justify-content-center align-items-center">
      <Card title="Welcome to My App!" className="home-card w-full max-w-600 text-center">
        <p className="mb-4">Connect with friends and the world around you on My App.</p>
        <div className="flex justify-content-center gap-2">
          <Link to="/login">
            <Button label="Login" className="p-button-primary" />
          </Link>
          <Link to="/register">
            <Button label="Register" className="p-button-secondary" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
