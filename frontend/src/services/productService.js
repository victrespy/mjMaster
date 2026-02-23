const API_URL = "https://localhost:9443/api";

// Función auxiliar para obtener el ID de una categoría por su nombre
const getCategoryIdByName = async (categoryName) => {
  try {
    console.log(`🔍 Buscando ID para categoría: "${categoryName}"`);
    const response = await fetch(`${API_URL}/categories?name=${encodeURIComponent(categoryName)}`, {
      headers: { "Accept": "application/ld+json" }
    });
    
    if (!response.ok) {
      console.error("❌ Error al buscar categoría:", response.statusText);
      return null;
    }
    
    const data = await response.json();
    const members = data['hydra:member'] || data.member || [];
    
    if (members.length > 0) {
      console.log(`✅ ID encontrado: ${members[0].id} para "${categoryName}"`);
      return members[0].id;
    }
    
    console.warn(`⚠️ No se encontró ninguna categoría con el nombre "${categoryName}"`);
    return null;
  } catch (error) {
    console.error("❌ Error buscando categoría:", error);
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
        console.warn(`⚠️ Filtrado cancelado: No se pudo obtener ID para "${categoryName}"`);
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

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: {
        "Accept": "application/ld+json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener categorías");
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
    console.error("Error en getCategories:", error);
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

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/ld+json",
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error al obtener producto con ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`Aviso: No se pudo cargar el producto ${id}.`);
    return null;
  }
};

export const createProduct = async (productData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createProduct:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateProduct:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el producto");
    }

    return true;
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    throw error;
  }
};

export const updateProductStock = async (id, newStock, token) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/merge-patch+json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ stock: newStock }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el stock del producto ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateProductStock:", error);
    throw error;
  }
};
