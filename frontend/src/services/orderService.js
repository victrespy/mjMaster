const API_URL = "https://localhost:9443/api";

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
