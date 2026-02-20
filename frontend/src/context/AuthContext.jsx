import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginService, logout as logoutService, getProfile } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar la app
  useEffect(() => {
    const loadUser = async () => {
      const profile = await getProfile();
      if (profile) {
        setUser(profile);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Obtener token
      await loginService(email, password);
      
      // 2. Obtener datos del usuario (nombre, rol, etc.)
      const profile = await getProfile();
      setUser(profile);

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
