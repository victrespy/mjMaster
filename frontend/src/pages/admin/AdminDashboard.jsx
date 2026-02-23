import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/statsService';

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-sage-200">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">No hay pedidos recientes.</td>
                </tr>
              ) : (
                stats.recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-sage-200/50 hover:bg-sage-50/5">
                    <td className="py-3">#{order.id}</td>
                    <td className="py-3">{order.user ? order.user.name : 'Usuario Eliminado'}</td>
                    <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 font-bold text-primary">{parseFloat(order.total).toFixed(2)} €</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-bold border border-green-500/30">
                        {order.state}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
