import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderState } from '../../services/orderService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 7;
  const [filters, setFilters] = useState({
    state: '',
    sortField: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadOrders(currentPage, filters);
  }, [currentPage, filters]);

  const loadOrders = async (page = 1, currentFilters = {}) => {
    try {
      setLoading(true);
      const data = await getOrders(page, itemsPerPage, currentFilters);
      setOrders(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (order, newState) => {
    if (window.confirm(`¿Cambiar estado del pedido #${order.id} a ${newState}?`)) {
      try {
        await updateOrderState(order.id, newState);
        loadOrders(currentPage, filters);
      } catch (error) {
        alert('Error al actualizar estado');
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Resetear a la primera página al filtrar
  };

  const columns = [
    { header: 'ID', accessor: 'id', className: 'text-gray-400 w-20' },
    { 
      header: 'Cliente', 
      render: (order) => (
        <div>
          <div className="font-medium text-gray-200">{order.user ? order.user.name : 'Usuario Eliminado'}</div>
          <div className="text-xs text-gray-500">{order.user ? order.user.email : ''}</div>
        </div>
      )
    },
    { 
      header: 'Fecha', 
      render: (order) => new Date(order.createdAt).toLocaleDateString() + ' ' + new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    },
    { 
      header: 'Total', 
      render: (order) => <span className="text-primary font-bold">{parseFloat(order.total).toFixed(2)} €</span> 
    },
    { 
      header: 'Estado', 
      render: (order) => {
        const stateKey = order.state ? order.state.toUpperCase() : '';
        const colors = {
          'PENDING': 'bg-blue-900/30 text-blue-400 border-blue-500/30',
          'PAID': 'bg-green-900/30 text-green-400 border-green-500/30',
          'SHIPPED': 'bg-purple-900/30 text-purple-400 border-purple-500/30',
          'COMPLETED': 'bg-teal-900/30 text-teal-400 border-teal-500/30',
          'CANCELLED': 'bg-red-900/30 text-red-400 border-red-500/30',
        };
        const labels = {
          'PENDING': 'PENDIENTE',
          'PAID': 'PAGADO',
          'SHIPPED': 'ENVIADO',
          'COMPLETED': 'COMPLETADO',
          'CANCELLED': 'CANCELADO',
        };
        const colorClass = colors[stateKey] || 'bg-gray-700/30 text-gray-400';
        const label = labels[stateKey] || stateKey;
        return (
          <span className={`px-2 py-1 rounded text-xs font-bold border ${colorClass}`}>
            {label}
          </span>
        );
      }
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Gestión de Pedidos" />

      {/* Barra de Filtros */}
      <div className="mb-6 flex flex-wrap gap-4 bg-card-bg p-4 rounded-xl border border-sage-200 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Filtrar por Estado</label>
          <select 
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary min-w-[150px]"
          >
            <option value="">TODOS LOS ESTADOS</option>
            <option value="PENDING">PENDIENTE</option>
            <option value="PAID">PAGADO</option>
            <option value="SHIPPED">ENVIADO</option>
            <option value="COMPLETED">COMPLETADO</option>
            <option value="CANCELLED">CANCELADO</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Ordenar por</label>
          <div className="flex gap-2">
            <select 
              name="sortField"
              value={filters.sortField}
              onChange={handleFilterChange}
              className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary"
            >
              <option value="createdAt">FECHA</option>
              <option value="state">ESTADO</option>
              <option value="total">TOTAL</option>
            </select>
            <select 
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary"
            >
              <option value="desc">DESC</option>
              <option value="asc">ASC</option>
            </select>
          </div>
        </div>
      </div>

      <AdminTable 
        columns={columns}
        data={orders}
        loading={loading}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        actions={(order) => (
          <div className="flex gap-2">
            {order.state !== 'COMPLETED' && order.state !== 'CANCELLED' && (
              <select 
                className="bg-dark-bg border border-sage-200/30 rounded text-xs text-gray-300 p-1 outline-none focus:border-primary"
                value=""
                onChange={(e) => handleStateChange(order, e.target.value)}
              >
                <option value="">CAMBIAR ESTADO...</option>
                <option value="PAID">PAGADO</option>
                <option value="SHIPPED">ENVIADO</option>
                <option value="COMPLETED">COMPLETADO</option>
                <option value="CANCELLED">CANCELADO</option>
              </select>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default AdminOrders;
