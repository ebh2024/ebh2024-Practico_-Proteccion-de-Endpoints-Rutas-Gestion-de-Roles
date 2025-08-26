import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

/**
 * Componente para la gestión de usuarios.
 * Permite a los administradores ver y modificar los roles de los usuarios.
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.toast - Referencia al componente Toast para mostrar notificaciones.
 */
const Users = ({ toast }) => {
  // Estados para almacenar la lista de usuarios y el filtro de búsqueda global
  const [users, setUsers] = useState([]);
  // Obtiene el token de sesión del almacenamiento local
  const token = sessionStorage.getItem('token');
  const [globalFilter, setGlobalFilter] = useState('');
  // Decodifica el token para obtener la información del usuario actual
  const decodedToken = token ? jwtDecode(token) : null;
  // Verifica si el usuario actual tiene rol de administrador
  const isAdmin = decodedToken && decodedToken.role === 'admin';

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
   * Obtiene la lista de usuarios desde la API.
   */
  const fetchUsers = async () => {
    try {
      // Si el usuario no es administrador, muestra un error de acceso denegado
      if (!isAdmin) {
        showToast('error', 'Acceso Denegado', 'No tienes privilegios administrativos para ver usuarios.');
        return;
      }
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      showToast('error', 'Error al Cargar Usuarios', error.response?.data?.message || 'Fallo al cargar los usuarios.');
    }
  };

  // Efecto para cargar los usuarios al montar el componente o cuando cambian isAdmin/token
  useEffect(() => {
    fetchUsers();
  }, [isAdmin, token]); // Dependencias: se ejecuta cuando isAdmin o token cambian

  /**
   * Maneja el cambio de rol de un usuario.
   * @param {string} userId - El ID del usuario cuyo rol se va a cambiar.
   * @param {string} newRole - El nuevo rol a asignar al usuario.
   */
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Envía una solicitud PUT a la API para actualizar el rol del usuario
      await api.put(`/users/${userId}/role`, { role: newRole });
      // Actualiza el estado local de los usuarios con el nuevo rol
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      showToast('success', 'Rol Actualizado', 'Rol de usuario actualizado correctamente.');
    } catch (error) {
      showToast('error', 'Error al Actualizar Rol', error.response?.data?.message || 'Fallo al actualizar el rol del usuario.');
    }
  };

  // Si el usuario no es administrador, muestra un mensaje de acceso denegado
  if (!isAdmin) {
    return <div className="text-center mt-4 error-message">Acceso Denegado: No tienes privilegios administrativos.</div>;
  }

  /**
   * Editor de rol para la tabla de usuarios.
   * Permite seleccionar un nuevo rol para un usuario a través de un Dropdown.
   * @param {object} rowData - Los datos de la fila actual de la tabla.
   * @returns {JSX.Element} Un componente Dropdown para seleccionar el rol.
   */
  const roleEditor = (rowData) => {
    // Opciones de roles disponibles para el Dropdown
    const roles = [
      { label: 'Usuario', value: 'user' },
      { label: 'Administrador', value: 'admin' },
      { label: 'Moderador', value: 'moderator' }
    ];
    return (
      <Dropdown
        value={rowData.role}
        options={roles}
        onChange={(e) => handleRoleChange(rowData.id, e.value)}
        placeholder="Seleccionar Rol"
      />
    );
  };

  // Encabezado de la tabla de usuarios con un campo de búsqueda
  const header = (
    <div className="table-header">
      <span className="p-input-icon-left w-full">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." className="w-full" />
      </span>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
      </div>
      <Card className="p-card">
        {/* Tabla de datos de usuarios */}
        <DataTable value={users} paginator rows={10} header={header} globalFilter={globalFilter} emptyMessage="No se encontraron usuarios.">
          <Column field="id" header="ID" sortable />
          <Column field="username" header="Nombre de Usuario" sortable />
          <Column field="role" header="Rol" body={roleEditor} />
        </DataTable>
      </Card>
    </div>
  );
};

export default Users;
