// src/components/ProtectedAdminRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Loader from "./Loader"; // Optional if you have a loader component

export default function ProtectedAdminRoute() {
  const { admin, loading } = useContext(AdminContext);

  // Show loader while checking token
  if (loading) return <Loader />;

  // If no admin logged in, redirect to login page
  if (!admin) return <Navigate to="/login" replace />;

  // Otherwise, allow access to admin pages
  return <Outlet />;
}
