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

const App = () => {
  const toast = useRef(null);
  return (
    <Router>
      <Toast ref={toast} />
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login toast={toast} /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register toast={toast} /></PublicRoute>} />
          <Route path="/products" element={<PrivateRoute><Products toast={toast} /></PrivateRoute>} />
          <Route path="/products/create" element={<PrivateRoute><CreateProduct toast={toast} /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users toast={toast} /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;