import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginService, logout as logoutService, getProfile } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar la app
  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setUser(profile);
        }
      } catch (error) {
        console.error("Error cargando usuario inicial:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // 1. Obtener token y datos básicos
      const loginData = await loginService(email, password);
      
      // 2. El servicio de login ya devuelve los datos decodificados del token
      // pero llamamos a getProfile para asegurar que tenemos los datos más frescos/completos
      const profile = await getProfile();
      setUser(profile || loginData);

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
