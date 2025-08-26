import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Importaciones de estilos de PrimeReact y PrimeFlex
import "primereact/resources/themes/lara-light-cyan/theme.css"; // Tema de PrimeReact
import "primereact/resources/primereact.min.css"; // Estilos base de PrimeReact
import "primeicons/primeicons.css"; // Iconos de PrimeIcons
import "primeflex/primeflex.css"; // Utilidades de flexbox de PrimeFlex

// Renderiza la aplicación React en el elemento con id 'root' en el DOM.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode activa comprobaciones y advertencias adicionales para sus descendientes.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
