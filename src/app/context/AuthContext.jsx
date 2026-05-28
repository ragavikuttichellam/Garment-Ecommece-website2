import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, clearAuthStorage, getAuthToken } from "../../services/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("garmentx_user");
      const storedToken = getAuthToken();

      if (stored && storedToken) {
        setUser(JSON.parse(stored));
        setToken(storedToken);
      } else {
        clearAuthStorage();
      }
    } catch {
      // ignore malformed storage data
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data;

      setUser(userData);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("garmentx_user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Backend login failed:", error.response?.data || error.message);
    }
    return false;
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await authAPI.register({ name, email, password, phone });
      const { token, ...userData } = response.data;

      setUser(userData);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("garmentx_user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Backend registration failed:", error.response?.data || error.message);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
