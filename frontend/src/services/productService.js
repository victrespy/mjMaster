const API_URL = "https://localhost:9443/api";

export const getProducts = async (page = 1, itemsPerPage = 30) => {
  try {
    const response = await fetch(`${API_URL}/products?page=${page}&itemsPerPage=${itemsPerPage}`, {
      method: "GET",
      headers: {
        "Accept": "application/ld+json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }

    const data = await response.json();
    return data['hydra:member'];
  } catch (error) {
    console.error("Error en getProducts:", error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    // Asumiendo que API Platform tiene habilitado un filtro de búsqueda parcial por nombre
    // Si no, esto podría requerir configuración en el backend.
    // Por defecto intentamos filtrar por nombre.
    const response = await fetch(`${API_URL}/products?name=${query}`, {
      method: "GET",
      headers: {
        "Accept": "application/ld+json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al buscar productos");
    }

    const data = await response.json();
    return data['hydra:member'];
  } catch (error) {
    console.error("Error en searchProducts:", error);
    throw error;
  }
};
