import { API_URL } from "../config";

const getAuthHeaders = (contentType = "application/ld+json") => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": contentType,
    "Accept": "application/ld+json",
  };
};

export const getUsers = async (page = 1, itemsPerPage = 30) => {
  try {
    const response = await fetch(`${API_URL}/users?page=${page}&itemsPerPage=${itemsPerPage}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error("Error al cargar usuarios");
    
    const data = await response.json();
    const items = data['hydra:member'] || data.member || (Array.isArray(data) ? data : []);
    const totalItems = data['hydra:totalItems'] || data.totalItems || items.length;

    return { items, totalItems };
  } catch (error) {
    console.error("Error en getUsers:", error);
    return { items: [], totalItems: 0 };
  }
};

export const updateUserRoles = async (id, roles) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders("application/merge-patch+json"),
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
      method: 'PATCH',
      headers: getAuthHeaders("application/merge-patch+json"),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData['hydra:description'] || "Error al actualizar perfil");
    }
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
