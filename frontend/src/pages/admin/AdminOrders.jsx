import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderState } from '../../services/orderService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(1, 50); // Traemos 50 por ahora
      setOrders(data.items);
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
        loadOrders();
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
        const colors = {
          'PENDING': 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
          'PAID': 'bg-blue-900/30 text-blue-400 border-blue-500/30',
          'SHIPPED': 'bg-purple-900/30 text-purple-400 border-purple-500/30',
          'COMPLETED': 'bg-green-900/30 text-green-400 border-green-500/30',
          'CANCELLED': 'bg-red-900/30 text-red-400 border-red-500/30',
        };
        const colorClass = colors[order.state] || 'bg-gray-700/30 text-gray-400';
        
        return (
          <span className={`px-2 py-1 rounded text-xs font-bold border ${colorClass}`}>
            {order.state}
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
        actions={(order) => (
          <div className="flex gap-2">
            {order.state !== 'COMPLETED' && order.state !== 'CANCELLED' && (
              <select 
                className="bg-dark-bg border border-sage-200/30 rounded text-xs text-gray-300 p-1 outline-none focus:border-primary"
                value=""
                onChange={(e) => handleStateChange(order, e.target.value)}
              >
                <option value="">Cambiar estado...</option>
                <option value="PAID">Pagado</option>
                <option value="SHIPPED">Enviado</option>
                <option value="COMPLETED">Completado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default AdminOrders;
