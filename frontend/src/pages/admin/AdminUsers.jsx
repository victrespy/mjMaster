import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRoles, deleteUser } from '../../services/userService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadUsers(currentPage, filters);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, filters]);

  const loadUsers = async (page = 1, currentFilters = {}) => {
    try {
      setLoading(true);
      const data = await getUsers(page, itemsPerPage, currentFilters);
      setUsers(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleToggleAdmin = async (user) => {
    const isAdmin = user.roles.includes('ROLE_ADMIN');
    const newRoles = isAdmin 
      ? user.roles.filter(r => r !== 'ROLE_ADMIN') 
      : [...user.roles, 'ROLE_ADMIN'];

    if (window.confirm(`¿Cambiar rol de ${user.email}?`)) {
      try {
        await updateUserRoles(user.id, newRoles);
        loadUsers(currentPage, filters);
      } catch (error) {
        alert('Error al actualizar rol');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción es irreversible.')) {
      try {
        await deleteUser(id);
        loadUsers(currentPage, filters);
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

      {/* Barra de Filtros */}
      <div className="mb-6 bg-card-bg p-4 rounded-xl border border-sage-200 shadow-sm flex flex-wrap gap-4">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Nombre</label>
          <input 
            type="text"
            name="name"
            placeholder="Buscar por nombre..."
            value={filters.name}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
          <input 
            type="text"
            name="email"
            placeholder="Buscar por email..."
            value={filters.email}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Rol</label>
          <select 
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          >
            <option value="">TODOS</option>
            <option value="ROLE_ADMIN">ADMINISTRADORES</option>
            <option value="ROLE_USER">USUARIOS</option>
          </select>
        </div>
      </div>

      <AdminTable 
        columns={columns}
        data={users}
        loading={loading}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
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
