import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRoles, deleteUser } from '../../services/userService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (user) => {
    const isAdmin = user.roles.includes('ROLE_ADMIN');
    const newRoles = isAdmin 
      ? user.roles.filter(r => r !== 'ROLE_ADMIN') 
      : [...user.roles, 'ROLE_ADMIN'];

    if (window.confirm(`¿Cambiar rol de ${user.email}?`)) {
      try {
        await updateUserRoles(user.id, newRoles);
        loadUsers();
      } catch (error) {
        alert('Error al actualizar rol');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción es irreversible.')) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (error) {
        alert('Error al eliminar usuario');
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', className: 'text-gray-400 w-20' },
    { header: 'Nombre', accessor: 'name', className: 'font-medium text-gray-200' },
    { header: 'Email', accessor: 'email', className: 'text-gray-300' },
    { 
      header: 'Roles', 
      render: (user) => user.roles.includes('ROLE_ADMIN') ? (
        <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-bold border border-purple-500/30">ADMIN</span>
      ) : (
        <span className="px-2 py-1 bg-gray-700/30 text-gray-400 rounded text-xs font-bold border border-gray-600/30">USER</span>
      )
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Gestión de Usuarios" />

      <AdminTable 
        columns={columns}
        data={users}
        loading={loading}
        onDelete={handleDelete}
        actions={(user) => (
          <button 
            onClick={() => handleToggleAdmin(user)}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
          >
            {user.roles.includes('ROLE_ADMIN') ? 'Quitar Admin' : 'Hacer Admin'}
          </button>
        )}
      />
    </div>
  );
};

export default AdminUsers;
