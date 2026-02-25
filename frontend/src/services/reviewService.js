const API_URL = "https://localhost:9443/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/ld+json",
    "Accept": "application/ld+json",
  };
};

export const getReviews = async (page = 1, itemsPerPage = 10, filters = {}) => {
  try {
    let url = `${API_URL}/reviews?page=${page}&itemsPerPage=${itemsPerPage}&order[createdAt]=desc`;
    
    if (filters.productName) {
      url += `&product.name=${encodeURIComponent(filters.productName)}`;
    }
    if (filters.userName) {
      url += `&user.name=${encodeURIComponent(filters.userName)}`;
    }
    if (filters.rating) {
      url += `&rating=${filters.rating}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error("Error al cargar reseñas");
    
    const data = await response.json();
    const items = data['hydra:member'] || data.member || [];
    const totalItems = data.totalItems || data['hydra:totalItems'] || items.length;

    return { items, totalItems };
  } catch (error) {
    console.error("Error en getReviews:", error);
    return { items: [], totalItems: 0 };
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Error al eliminar reseña");
    return true;
  } catch (error) {
    console.error("Error en deleteReview:", error);
    throw error;
  }
};
