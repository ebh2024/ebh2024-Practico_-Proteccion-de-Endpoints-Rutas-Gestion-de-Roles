import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const Login = ({ toast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      sessionStorage.setItem('token', response.data.accessToken);
      showToast('success', 'Login Exitoso', 'Has iniciado sesión correctamente.');
      setTimeout(() => navigate('/products'), 1000);
    } catch (error) {
      showToast('error', 'Error de Login', error.response?.data || 'Credenciales inválidas.');
    }
  };

  return (
    <div className="form-container flex justify-content-center align-items-center">
      <Card title="Login" className="form-card w-full max-w-400">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="username">Username</label>
              <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" label="Login" className="p-button-primary mt-4" />
        </form>
      </Card>
    </div>
  );
};

export default Login;