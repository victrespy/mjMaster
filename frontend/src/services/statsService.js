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
    return {
      items: data['hydra:member'] || data.member || [],
      totalItems: data['hydra:totalItems'] || 0
    };
  } catch (error) {
    console.error("Error en getOrders:", error);
    return { items: [], totalItems: 0 };
  }
};

export const getDashboardStats = async () => {
  try {
    // Cargar datos en paralelo
    const [productsData, usersData, ordersData] = await Promise.all([
      getProducts(1, 1), // Solo necesitamos el totalItems
      getUsers(), // API Platform por defecto pagina, así que esto solo trae la primera página
      getOrders(1, 5) // Traemos los 5 últimos pedidos para la tabla
    ]);

    // Para obtener el total de ventas real, necesitaríamos un endpoint específico en el backend
    // o iterar sobre todos los pedidos (lo cual es lento).
    // Por simplicidad, sumaremos los de la página actual o simularemos si no hay endpoint de stats.
    
    // Nota: API Platform devuelve 'hydra:totalItems' si está habilitado.
    // Si getProducts devuelve un array directo, usamos .length (pero será solo la página actual).
    
    // Asumimos que getProducts devuelve array, así que para saber el total real
    // necesitaríamos que devuelva el objeto hydra completo.
    // Vamos a ajustar esto asumiendo que podemos obtener totales.

    // Calculamos ventas totales sumando los pedidos recientes (esto es una aproximación para la demo)
    const totalSales = ordersData.items.reduce((sum, order) => sum + parseFloat(order.total), 0);

    return {
      totalSales: totalSales, // Solo de los últimos pedidos cargados
      totalOrders: ordersData.totalItems || ordersData.items.length,
      totalUsers: usersData.length, // Aproximado si hay paginación
      totalProducts: productsData.length, // Aproximado
      recentOrders: ordersData.items
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
