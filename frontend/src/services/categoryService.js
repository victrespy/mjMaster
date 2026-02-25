const API_URL = "https://localhost:9443/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/ld+json",
    "Accept": "application/ld+json",
  };
};

export const getCategories = async (page = 1, itemsPerPage = 10, filters = {}) => {
  try {
    let url = `${API_URL}/categories?page=${page}&itemsPerPage=${itemsPerPage}`;
    
    if (filters.name) {
      url += `&name=${encodeURIComponent(filters.name)}`;
    }

    const response = await fetch(url, {
      headers: { "Accept": "application/ld+json" }
    });
    
    if (!response.ok) throw new Error("Error al cargar categorías");
    
    const data = await response.json();
    const items = data['hydra:member'] || data.member || [];
    const totalItems = data.totalItems || data['hydra:totalItems'] || items.length;

    return { items, totalItems };
  } catch (error) {
    console.error("Error en getCategories:", error);
    return { items: [], totalItems: 0 };
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) throw new Error("Error al crear categoría");
    return await response.json();
  } catch (error) {
    console.error("Error en createCategory:", error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) throw new Error("Error al actualizar categoría");
    return await response.json();
  } catch (error) {
    console.error("Error en updateCategory:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al eliminar categoría");
    return true;
  } catch (error) {
    console.error("Error en deleteCategory:", error);
    throw error;
  }
};
