import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Users from './components/Users';
import CreateProduct from './components/CreateProduct';
import PrivateRoute from './auth/PrivateRoute';
import PublicRoute from './auth/PublicRoute';

/**
 * Componente principal de la aplicación.
 * Configura las rutas de la aplicación y renderiza la barra de navegación y los componentes de ruta.
 */
const App = () => {
  // Referencia para el componente Toast, utilizado para mostrar notificaciones.
  const toast = useRef(null);

  return (
    <Router>
      {/* Componente Toast para mostrar mensajes de notificación */}
      <Toast ref={toast} />
      {/* Barra de navegación de la aplicación */}
      <Navbar />
      <div className="container">
        {/* Definición de las rutas de la aplicación */}
        <Routes>
          {/* Ruta de inicio */}
          <Route path="/" element={<Home />} />
          {/* Rutas públicas para Login y Register, envueltas en PublicRoute */}
          <Route path="/login" element={<PublicRoute><Login toast={toast} /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register toast={toast} /></PublicRoute>} />
          {/* Rutas privadas para Products, CreateProduct y Users, envueltas en PrivateRoute */}
          <Route path="/products" element={<PrivateRoute><Products toast={toast} /></PrivateRoute>} />
          <Route path="/products/create" element={<PrivateRoute><CreateProduct toast={toast} /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users toast={toast} /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
