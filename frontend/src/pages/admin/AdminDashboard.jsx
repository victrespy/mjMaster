import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/statsService';
import AdminTable from '../../components/admin/AdminTable'; // Importar AdminTable

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-card-bg border border-sage-200 rounded-xl p-6 shadow-lg flex items-center">
    <div className={`p-4 rounded-full ${color} bg-opacity-20 mr-4`}>
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${color.replace('bg-', 'text-')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium uppercase">{title}</p>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  const orderColumns = [
    { header: 'ID', render: (order) => `#${order.id}` },
    { header: 'Cliente', render: (order) => order.user ? order.user.name : 'Usuario Eliminado' },
    { 
      header: 'Fecha y Hora', 
      render: (order) => (
        <div>
          <div className="text-gray-200">{new Date(order.createdAt).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
    { header: 'Total', render: (order) => <span className="font-bold text-primary">{parseFloat(order.total).toFixed(2)} €</span> },
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
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard 
          title="Ventas (Recientes)" 
          value={`${stats.totalSales.toFixed(2)} €`} 
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          color="bg-green-500"
        />
        <StatCard 
          title="Pedidos Totales" 
          value={stats.totalOrders} 
          icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          color="bg-blue-500"
        />
        <StatCard 
          title="Usuarios" 
          value={stats.totalUsers} 
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          color="bg-purple-500"
        />
        <StatCard 
          title="Productos" 
          value={stats.totalProducts} 
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          color="bg-yellow-500"
        />
      </div>

      <div className="bg-card-bg border border-sage-200 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Últimos Pedidos</h2>
        <AdminTable
          columns={orderColumns}
          data={stats.recentOrders}
          loading={loading}
          mobileHeader={(order) => (
            <div className="flex justify-between items-center w-full pr-4">
              <span className="font-bold">{order.user ? order.user.name : 'Usuario Eliminado'}</span>
              <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
