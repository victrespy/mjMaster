const API_URL = "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    // NO poner Content-Type aquí, el navegador lo pone automáticamente con el boundary correcto para FormData
  };
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/media_objects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      // Intentar leer el error JSON del backend si existe
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al subir la imagen");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error en uploadImage:", error);
    throw error;
  }
};
