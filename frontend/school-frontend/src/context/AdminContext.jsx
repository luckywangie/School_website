import { createContext, useState, useEffect } from "react";
import { loginAdmin, logoutAdmin } from "../services/authService";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get admin profile
      fetchAdminProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginAdmin(email, password);
      setAdmin(data.admin);
      localStorage.setItem("token", data.access_token);
      return { success: true, token: data.access_token };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Login failed" 
      };
    }
  };

  const logout = () => {
    logoutAdmin();
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

