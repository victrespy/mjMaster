const API_URL = "/api";

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

export const createOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error detallado del servidor:", errorData);

      let errorMessage = 'Error al procesar el pedido';

      if (errorData['hydra:description']) {
        errorMessage = errorData['hydra:description'];
      } else if (errorData['detail']) {
        errorMessage = errorData['detail'];
      } else if (errorData['violations']) {
        errorMessage = errorData['violations'].map(v => `${v.propertyPath}: ${v.message}`).join(', ');
      } else if (response.statusText) {
        errorMessage = `${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
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
    // Nota: API Platform usa 'user.id' o 'user' dependiendo de la configuración de filtros
    // Asumimos que hay un filtro SearchFilter en Order.php para 'user'
    const response = await fetch(`${API_URL}/orders?user=${userId}&order[createdAt]=desc`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Error al cargar mis pedidos");

    const data = await response.json();
    return data['hydra:member'] || data.member || [];
  } catch (error) {
    console.error("Error en getMyOrders:", error);
    return [];
  }
};
