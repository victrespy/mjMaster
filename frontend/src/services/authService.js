const API_URL = "https://localhost:9443/api"; // Backend en puerto 9443

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login_check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciales inválidas");
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData['hydra:description'] || "Error en el registro");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = () => {
  // Aquí podríamos decodificar el JWT si quisiéramos saber el rol o email sin llamar a la API
  return localStorage.getItem("token");
};
