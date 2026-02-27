import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/orderService';
import { updateUserProfile } from '../services/userService';
import Button from '../components/Button';
import OrderDetailModal from '../components/OrderDetailModal';
import AdminTable from '../components/admin/AdminTable';

const UserProfile = () => {
  const { user, logout } = useAuth(); 
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders'
  
  // Estado para edición de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Estado para detalle de pedido
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      loadOrders();
    }
  }, [user, activeTab]);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      if (user.id) {
        const data = await getMyOrders(user.id);
        setOrders(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateUserProfile(user.id, formData);
      alert('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      alert('Error al actualizar perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleOrderUpdated = () => {
    loadOrders();
  };

  const orderColumns = [
    { 
      header: 'ID Pedido', 
      render: (order) => <span className="font-medium text-gray-200">#{order.id}</span>
    },
    { 
      header: 'Fecha', 
      render: (order) => <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
    },
    { 
      header: 'Total', 
      render: (order) => <span className="font-bold text-primary">{parseFloat(order.total).toFixed(2)} €</span>
    },
    { 
      header: 'Estado', 
      render: (order) => (
        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-bold border border-green-500/30">
          {order.state}
        </span>
      )
    },
  ];

  if (!user) return <div className="text-center py-20 text-gray-400">Cargando perfil...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Mi Cuenta</h1>

      <div className="flex flex-col min-[890px]:flex-row gap-8">
        {/* Sidebar de Navegación */}
        <div className="min-[890px]:w-1/4">
          <div className="bg-card-bg border border-sage-200 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-sage-200 text-center">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-3xl font-bold text-primary mb-4">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="text-xl font-bold text-gray-100">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  activeTab === 'profile' 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-400 hover:bg-sage-50/5 hover:text-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mis Datos
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  activeTab === 'orders' 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-400 hover:bg-sage-50/5 hover:text-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Mis Pedidos
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center text-red-400 hover:bg-red-900/10 hover:text-red-300 mt-4 border-t border-sage-200/50 pt-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="min-[890px]:w-3/4">
          {activeTab === 'profile' && (
            <div className="bg-card-bg border border-sage-200 rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-100">Información Personal</h3>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="text-sm py-1 px-3">
                    Editar Perfil
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-sage-50 border border-sage-200 rounded px-3 py-2 text-gray-100 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-1">Email (No editable)</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full bg-sage-50/50 border border-sage-200/50 rounded px-3 py-2 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-sage-50 border border-sage-200 rounded px-3 py-2 text-gray-100 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-1">Dirección</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-sage-50 border border-sage-200 rounded px-3 py-2 text-gray-100 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary" disabled={savingProfile}>
                      {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Nombre Completo</label>
                    <div className="bg-sage-50/5 border border-sage-200/20 rounded px-4 py-3 text-gray-200">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Email</label>
                    <div className="bg-sage-50/5 border border-sage-200/20 rounded px-4 py-3 text-gray-200">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Teléfono</label>
                    <div className="bg-sage-50/5 border border-sage-200/20 rounded px-4 py-3 text-gray-200">
                      {user.phone || 'No especificado'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">Dirección</label>
                    <div className="bg-sage-50/5 border border-sage-200/20 rounded px-4 py-3 text-gray-200">
                      {user.address || 'No especificada'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="bg-card-bg border border-sage-200 rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="p-6 border-b border-sage-200">
                  <h3 className="text-2xl font-bold text-gray-100">Historial de Pedidos</h3>
                </div>
              </div>
              
              {orders.length === 0 && !loadingOrders ? (
                <div className="p-12 text-center text-gray-400 bg-card-bg border border-sage-200 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p>Aún no has realizado ningún pedido.</p>
                  <Button to="/products" variant="primary" className="mt-4">
                    Ir a la Tienda
                  </Button>
                </div>
              ) : (
                <AdminTable
                  columns={orderColumns}
                  data={orders}
                  loading={loadingOrders}
                  mobileHeader={(order) => (
                    <div className="flex justify-between items-center w-full pr-4">
                      <span className="font-bold">Pedido #{order.id}</span>
                      <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  actions={(order) => (
                    <button 
                      onClick={() => handleViewOrder(order)}
                      className="text-primary hover:text-white text-sm font-medium transition-colors"
                    >
                      Ver Detalles
                    </button>
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Pedido */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
};

export default UserProfile;
