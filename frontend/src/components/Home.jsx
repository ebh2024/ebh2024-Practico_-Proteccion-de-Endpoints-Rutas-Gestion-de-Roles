import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Card } from 'primereact/card';

const Home = () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      jwtDecode(token);
      return <Navigate to="/products" />;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  }

  return (
    <div className="home-container flex justify-content-center align-items-center">
      <Card title="Welcome to the Application!" className="home-card w-full max-w-600 text-center">
        <p>Please log in or register to continue.</p>
      </Card>
    </div>
  );
};

export default Home;
