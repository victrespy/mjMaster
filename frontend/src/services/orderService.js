const API_URL = "https://localhost:9443/api";

const getAuthHeaders = (contentType = "application/ld+json") => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": contentType,
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

export const updateOrderState = async (id, state) => {
  try {
    // Usamos PATCH para actualización parcial
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders("application/merge-patch+json"),
      body: JSON.stringify({ state })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData['hydra:description'] || "Error al actualizar estado del pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateOrderState:", error);
    throw error;
  }
};

export const createOrder = async (cartItems) => {
  try {
    // Preparamos los datos para el backend
    // Solo necesitamos ID y cantidad
    const itemsToSend = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    // Usamos el endpoint personalizado /api/checkout
    const response = await fetch(`${API_URL}/checkout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ items: itemsToSend }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al procesar el pedido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createOrder:", error);
    throw error;
  }
};

export const getMyOrders = async (userId) => {
  try {
    // Filtramos por ID de usuario y ordenamos por fecha descendente
    const response = await fetch(`${API_URL}/orders?user.id=${userId}&order[createdAt]=desc`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Error al cargar pedidos");

    const data = await response.json();
    return data['hydra:member'] || data.member || [];
  } catch (error) {
    console.error("Error en getMyOrders:", error);
    return [];
  }
};
