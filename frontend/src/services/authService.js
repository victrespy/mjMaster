import { jwtDecode } from "jwt-decode";
import { API_URL } from "../config";

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
      const decoded = jwtDecode(data.token);
      return { token: data.token, ...decoded };
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

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Llamada real al endpoint /api/me para obtener el objeto User completo (con ID)
    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return null;
      }
      throw new Error("Error al obtener perfil");
    }

    const userData = await response.json();
    return { ...userData, token }; // Combinamos los datos del usuario con el token

  } catch (error) {
    console.error("Error en getProfile:", error);
    // Fallback a decodificación básica si falla la red pero hay token
    try {
      const decoded = jwtDecode(token);
      return { ...decoded, token };
    } catch (e) {
      return null;
    }
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return null;
    }
    return { token, ...decoded };
  } catch (error) {
    return null;
  }
};
