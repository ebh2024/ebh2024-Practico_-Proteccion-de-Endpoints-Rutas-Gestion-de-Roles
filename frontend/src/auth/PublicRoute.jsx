import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      jwtDecode(token);
      return <Navigate to="/products" />;
    } catch {
      return children;
    }
  }

  return children;
};

export default PublicRoute;
