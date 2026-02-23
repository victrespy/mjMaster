const API_URL = "https://localhost:9443/api";

// Función auxiliar para obtener el ID de una categoría por su nombre
const getCategoryIdByName = async (categoryName) => {
  try {
    const response = await fetch(`${API_URL}/categories?name=${encodeURIComponent(categoryName)}`, {
      headers: { "Accept": "application/ld+json" }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const members = data['hydra:member'] || data.member || [];
    
    if (members.length > 0) {
      return members[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error buscando categoría:", error);
    return null;
  }
};

export const getProducts = async (page = 1, itemsPerPage = 30, categoryName = null) => {
  try {
    let url = `${API_URL}/products?page=${page}&itemsPerPage=${itemsPerPage}`;
    
    if (categoryName) {
      const categoryId = await getCategoryIdByName(categoryName);
      if (categoryId) {
        url += `&category=${categoryId}`;
      } else {
        return [];
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/ld+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data['hydra:member']) {
      return data['hydra:member'];
    } else if (data.member) {
      return data.member;
    } else if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error) {
    console.error("Error en getProducts:", error);
    return [];
  }
};

export const searchProducts = async (query) => {
  try {
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
    
    if (data['hydra:member']) {
      return data['hydra:member'];
    } else if (data.member) {
      return data.member;
    } else if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    console.error("Error en searchProducts:", error);
    return [];
  }
};

// --- NUEVAS FUNCIONES CRUD ---

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/ld+json",
    "Accept": "application/ld+json",
  };
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData['hydra:description'] || "Error al crear producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createProduct:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData['hydra:description'] || "Error al actualizar producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateProduct:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar producto");
    }

    return true;
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: { "Accept": "application/ld+json" }
    });
    
    if (!response.ok) throw new Error("Error al cargar categorías");
    
    const data = await response.json();
    return data['hydra:member'] || data.member || [];
  } catch (error) {
    console.error("Error en getCategories:", error);
    return [];
  }
};
