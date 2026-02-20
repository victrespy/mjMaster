import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginService, logout as logoutService, getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCurrentUser();
    if (token) {
      // Aquí podríamos llamar a /api/users/me para obtener los datos reales del usuario
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password);
      setUser({ token: data.token });
      return true;
    } catch (error) {
      console.error("Login fallido:", error);
      return false;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
