import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router-dom';

/**
 * Componente de registro de usuario (Register).
 * Permite a los nuevos usuarios crear una cuenta en la aplicación.
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.toast - Referencia al componente Toast para mostrar notificaciones.
 */
const Register = ({ toast }) => {
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
   * Maneja el envío del formulario de registro.
   * @param {Event} e - El evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envía una solicitud POST a la API para registrar un nuevo usuario
      await axios.post('http://localhost:3000/auth/register', { username, password });
      showToast('success', 'Registro Exitoso', 'Usuario registrado correctamente.');
      // Redirige a la página de inicio de sesión después de un registro exitoso
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      // Muestra un mensaje de error si el registro falla
      showToast('error', 'Error de Registro', error.response?.data || 'Fallo el registro. El usuario ya podría existir.');
    }
  };

  return (
    <div className="form-container flex justify-content-center align-items-center">
      <Card title="Registrarse" className="form-card w-full max-w-400">
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
          <Button type="submit" label="Registrarse" className="p-button-primary mt-4 w-full" />
        </form>
        <Divider align="center">
          <span className="p-text-secondary">O</span>
        </Divider>
        <div className="text-center">
          <Link to="/login">
            <Button label="¿Ya tienes una cuenta?" className="p-button-secondary" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
