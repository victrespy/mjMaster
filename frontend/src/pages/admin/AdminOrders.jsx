import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderState } from '../../services/orderService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getOrders(page, itemsPerPage);
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
        loadOrders(currentPage);
      } catch (error) {
        alert('Error al actualizar estado');
      }
    }
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
      render: (order) => new Date(order.createdAt).toLocaleDateString() + ' ' + new Date(order.createdAt).toLocaleTimeString() 
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
          'PENDING': 'bg-blue-900/30 text-blue-400 border-blue-500/30', // AZUL
          'PAID': 'bg-green-900/30 text-green-400 border-green-500/30', // VERDE (Pagado es bueno)
          'SHIPPED': 'bg-purple-900/30 text-purple-400 border-purple-500/30',
          'COMPLETED': 'bg-teal-900/30 text-teal-400 border-teal-500/30', // TEAL para completado final
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
