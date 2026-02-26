import { API_URL } from "../config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/ld+json",
  };
};

export const getDashboardStats = async () => {
  try {
    // Peticiones paralelas para optimizar
    const [productsRes, usersRes, ordersRes] = await Promise.all([
      fetch(`${API_URL}/products?page=1&itemsPerPage=1`, { headers: getAuthHeaders() }),
      fetch(`${API_URL}/users?page=1&itemsPerPage=1`, { headers: getAuthHeaders() }),
      fetch(`${API_URL}/orders?page=1&itemsPerPage=5&order[createdAt]=desc`, { headers: getAuthHeaders() })
    ]);

    const productsData = await productsRes.json();
    const usersData = await usersRes.json();
    const ordersData = await ordersRes.json();

    return {
      totalProducts: productsData['hydra:totalItems'] || 0,
      totalUsers: usersData['hydra:totalItems'] || 0,
      totalOrders: ordersData['hydra:totalItems'] || 0,
      recentOrders: ordersData['hydra:member'] || [],
      totalSales: (ordersData['hydra:member'] || []).reduce((acc, o) => acc + parseFloat(order.total || 0), 0) // Estimación
    };
  } catch (error) {
    console.error("Error en getDashboardStats:", error);
    return { totalProducts: 0, totalUsers: 0, totalOrders: 0, recentOrders: [], totalSales: 0 };
  }
};
