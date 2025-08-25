import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const Users = ({ toast }) => {
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem('token');
  const [globalFilter, setGlobalFilter] = useState('');
  const decodedToken = token ? jwtDecode(token) : null;
  const isAdmin = decodedToken && decodedToken.role === 'admin';

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const fetchUsers = async () => {
    try {
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

  useEffect(() => {
    fetchUsers();
  }, [isAdmin, token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      showToast('success', 'Rol Actualizado', 'Rol de usuario actualizado correctamente.');
    } catch (error) {
      showToast('error', 'Error al Actualizar Rol', error.response?.data?.message || 'Fallo al actualizar el rol del usuario.');
    }
  };

  if (!isAdmin) {
    return <div className="text-center mt-4 error-message">Acceso Denegado: No tienes privilegios administrativos.</div>;
  }

  const roleEditor = (rowData) => {
    const roles = [
      { label: 'User', value: 'user' },
      { label: 'Admin', value: 'admin' },
      { label: 'Moderator', value: 'moderator' }
    ];
    return (
      <Dropdown
        value={rowData.role}
        options={roles}
        onChange={(e) => handleRoleChange(rowData.id, e.value)}
        placeholder="Select a Role"
      />
    );
  };

  const header = (
    <div className="table-header">
      <span className="p-input-icon-left w-full">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="w-full" />
      </span>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>
      <Card className="p-card">
        <DataTable value={users} paginator rows={10} header={header} globalFilter={globalFilter} emptyMessage="No users found.">
          <Column field="id" header="ID" sortable />
          <Column field="username" header="Username" sortable />
          <Column field="role" header="Role" body={roleEditor} />
        </DataTable>
      </Card>
    </div>
  );
};

export default Users;
