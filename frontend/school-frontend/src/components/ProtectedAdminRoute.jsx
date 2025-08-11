// src/components/ProtectedAdminRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

export default function ProtectedAdminRoute() {
  const { admin, loading } = useContext(AdminContext);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
