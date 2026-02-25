const API_URL = "https://localhost:9443/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/ld+json",
    "Accept": "application/ld+json",
  };
};

export const getUsers = async (page = 1, itemsPerPage = 10) => {
  try {
    const response = await fetch(`${API_URL}/users?page=${page}&itemsPerPage=${itemsPerPage}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error("Error al cargar usuarios");
    
    const data = await response.json();
    const items = data['hydra:member'] || data.member || [];
    const totalItems = data.totalItems || data['hydra:totalItems'] || items.length;

    return { items, totalItems };
  } catch (error) {
    console.error("Error en getUsers:", error);
    return { items: [], totalItems: 0 };
  }
};

export const updateUserRoles = async (id, roles) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ roles }),
    });

    if (!response.ok) throw new Error("Error al actualizar roles");
    return await response.json();
  } catch (error) {
    console.error("Error en updateUserRoles:", error);
    throw error;
  }
};

export const updateUserProfile = async (id, userData) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Error al actualizar perfil");
    return await response.json();
  } catch (error) {
    console.error("Error en updateUserProfile:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al eliminar usuario");
    return true;
  } catch (error) {
    console.error("Error en deleteUser:", error);
    throw error;
  }
};
