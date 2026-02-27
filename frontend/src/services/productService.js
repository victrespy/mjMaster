import { API_URL } from "../config";

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

/**
 * Obtiene productos con filtros, búsqueda, ordenación y paginación
 */
export const getProducts = async (params = {}) => {
  const {
    page = 1,
    itemsPerPage = 7,
    categoryName = null,
    orderBy = null,
    filters = {},
    search = null
  } = params;

  try {
    let url = `${API_URL}/products?page=${page}&itemsPerPage=${itemsPerPage}`;
    
    // Filtro por nombre (búsqueda)
    if (search) {
      url += `&name=${encodeURIComponent(search)}`;
    }

    // Filtro por categoría
    if (categoryName) {
      const categoryId = await getCategoryIdByName(categoryName);
      if (categoryId) {
        url += `&category=${categoryId}`;
      } else {
        // Si se pide una categoría que no existe, devolvemos vacío
        return { items: [], totalItems: 0 };
      }
    }

    // Ordenación
    if (orderBy) {
      Object.keys(orderBy).forEach(key => {
        url += `&order[${key}]=${orderBy[key]}`;
      });
    }

    // Otros filtros (como precio[gte], precio[lte])
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          url += `&${key}=${filters[key]}`;
        }
      });
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
    const items = data['hydra:member'] || data.member || (Array.isArray(data) ? data : []);
    const totalItems = data['hydra:totalItems'] || data.totalItems || 0;
    
    return { items, totalItems };
  } catch (error) {
    console.error("Error en getProducts:", error);
    return { items: [], totalItems: 0 };
  }
};

// Mantenemos searchProducts por compatibilidad si se usa en otros sitios, 
// pero redirigimos a getProducts
export const searchProducts = async (query) => {
  return getProducts({ search: query });
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: { "Accept": "application/ld+json" }
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error obteniendo producto ${id}:`, error);
    return null;
  }
};

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

export const updateProductStock = async (id, newStock, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/merge-patch+json",
        "Accept": "application/ld+json",
      },
      body: JSON.stringify({ stock: newStock }),
    });

    if (!response.ok) throw new Error("Error al actualizar stock");
    return await response.json();
  } catch (error) {
    console.error("Error en updateProductStock:", error);
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
