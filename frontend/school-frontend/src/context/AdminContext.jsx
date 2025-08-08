import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await api.get("/auth/me"); // ✅ Must match /api/auth/me
      setAdmin(res.data.admin); // ✅ backend should return { admin: { ... } }
    } catch (err) {
      console.error("Auth fetch failed:", err);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials); // ✅ Must match /api/auth/login
    localStorage.setItem("token", res.data.token);
    await fetchAdmin();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}
