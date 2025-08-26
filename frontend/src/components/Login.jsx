import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router-dom';

/**
 * Componente de inicio de sesión (Login).
 * Permite a los usuarios ingresar sus credenciales para autenticarse
 * y acceder a las funcionalidades de la aplicación.
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.toast - Referencia al componente Toast para mostrar notificaciones.
 */
const Login = ({ toast }) => {
  // Estados para almacenar el nombre de usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  /**
   * Muestra una notificación Toast.
   * @param {string} severity - La severidad de la notificación (ej. 'success', 'error').
   * @param {string} summary - El resumen o título de la notificación.
   * @param {string} detail - El mensaje detallado de la notificación.
   */
  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envía una solicitud POST a la API para autenticar al usuario
      const response = await api.post('/auth/login', { username, password });
      // Almacena el token de acceso en el almacenamiento de sesión
      sessionStorage.setItem('token', response.data.accessToken);
      showToast('success', 'Inicio de Sesión Exitoso', 'Has iniciado sesión correctamente.');
      // Redirige a la página de productos después de un inicio de sesión exitoso
      setTimeout(() => navigate('/products'), 1000);
    } catch (error) {
      // Muestra un mensaje de error si el inicio de sesión falla
      showToast('error', 'Error de Inicio de Sesión', error.response?.data || 'Credenciales inválidas.');
    }
  };

  return (
    <div className="form-container flex justify-content-center align-items-center">
      <Card title="Iniciar Sesión" className="form-card w-full max-w-400">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="username">Nombre de Usuario</label>
              <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" label="Iniciar Sesión" className="p-button-primary mt-4 w-full" />
        </form>
        <Divider align="center">
          <span className="p-text-secondary">O</span>
        </Divider>
        <div className="text-center">
          <Link to="/register">
            <Button label="Crear Nueva Cuenta" className="p-button-success" style={{ backgroundColor: '#42b72a', borderColor: '#42b72a' }} />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
