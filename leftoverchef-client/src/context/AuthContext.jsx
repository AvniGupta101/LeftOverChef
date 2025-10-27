import React, { createContext, useState, useEffect } from "react";
import { api } from "../api/client";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Attach token to axios globally
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Keep user in localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login(email, password) {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.error || "Login failed" };
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password, role = "ngo") {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", { name, email, password, role });
      if (res.status === 200 || res.status === 201) {
        return { success: true, message: "Registered successfully. You can now log in." };
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.error || "Registration failed" };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

