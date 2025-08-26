import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router-dom';

const Register = ({ toast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/register', { username, password });
      showToast('success', 'Registro Exitoso', 'Usuario registrado correctamente.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
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
