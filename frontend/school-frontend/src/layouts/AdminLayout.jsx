// src/layouts/AdminLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";

export default function AdminLayout() {
  const { admin, logout } = useContext(AdminContext);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div>
          <span className="mr-4">Hello, {admin?.name}</span>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-gray-100 p-4 flex space-x-4">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/news"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          News
        </NavLink>
        <NavLink
          to="/admin/gallery"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Gallery
        </NavLink>
        <NavLink
          to="/admin/staff"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Staff
        </NavLink>
        <NavLink
          to="/admin/results"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Results
        </NavLink>
        <NavLink
          to="/admin/tenders"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Tenders
        </NavLink>
        <NavLink
          to="/admin/messages"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Messages
        </NavLink>
      </nav>

      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
