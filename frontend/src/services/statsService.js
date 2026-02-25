import { getProducts } from './productService';
import { getUsers } from './userService';

const API_URL = "https://localhost:9443/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/ld+json",
  };
};

export const getOrders = async (page = 1, itemsPerPage = 30) => {
  try {
    const response = await fetch(`${API_URL}/orders?page=${page}&itemsPerPage=${itemsPerPage}&order[createdAt]=desc`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error("Error al cargar pedidos");
    
    const data = await response.json();
    const items = data['hydra:member'] || data.member || [];
    const totalItems = data.totalItems || data['hydra:totalItems'] || items.length;

    return { items, totalItems };
  } catch (error) {
    console.error("Error en getOrders:", error);
    return { items: [], totalItems: 0 };
  }
};

export const getDashboardStats = async () => {
  try {
    // Cargar datos en paralelo
    const [productsData, usersData, ordersData] = await Promise.all([
      getProducts(1, 1),
      getUsers(1, 1),
      getOrders(1, 5) // Volvemos a 5 pedidos
    ]);

    // Ordenar explícitamente por fecha descendente (más reciente primero)
    // Usamos getTime() para asegurar una comparación numérica precisa
    const sortedOrders = [...ordersData.items].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // Calculamos ventas totales sumando los pedidos recientes
    const totalSales = sortedOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);

    return {
      totalSales: totalSales,
      totalOrders: ordersData.totalItems || sortedOrders.length,
      totalUsers: usersData.totalItems || 0,
      totalProducts: productsData.totalItems || 0,
      recentOrders: sortedOrders
    };
  } catch (error) {
    console.error("Error cargando estadísticas:", error);
    return {
      totalSales: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      recentOrders: []
    };
  }
};
