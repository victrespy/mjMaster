const API_URL = "https://localhost:9443/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
};

export const createOrder = async (cartItems) => {
  try {
    // Preparamos los datos para el backend
    // Solo necesitamos ID y cantidad
    const itemsToSend = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const response = await fetch(`${API_URL}/checkout`, {
      method: "POST",
      headers: getAuthHeaders(),
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
