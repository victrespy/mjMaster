const API_URL = "https://localhost:9443/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/ld+json",
    "Accept": "application/ld+json",
  };
};

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error("Error al cargar usuarios");
    
    const data = await response.json();
    return data['hydra:member'] || data.member || [];
  } catch (error) {
    console.error("Error en getUsers:", error);
    return [];
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
