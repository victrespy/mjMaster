const API_URL = "https://localhost:9443/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/ld+json",
    "Accept": "application/ld+json",
  };
};

export const getReviews = async (page = 1, itemsPerPage = 30) => {
  try {
    const response = await fetch(`${API_URL}/reviews?page=${page}&itemsPerPage=${itemsPerPage}&order[createdAt]=desc`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error("Error al cargar reseñas");
    
    const data = await response.json();
    return {
      items: data['hydra:member'] || data.member || [],
      totalItems: data['hydra:totalItems'] || 0
    };
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
