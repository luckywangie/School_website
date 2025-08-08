// src/layouts/AdminLayout.jsx
import { useState, useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AdminContext } from "../context/AdminContext";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(AdminContext);
  const navigate = useNavigate();

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/messages", label: "Messages" },
    { to: "/admin/news", label: "Manage News" },
    { to: "/admin/tenders", label: "Manage Tenders" },
    { to: "/admin/staff", label: "Manage Staff" },
    { to: "/admin/departments", label: "Manage Departments" },
    { to: "/admin/pages", label: "Manage Pages" },
    { to: "/admin/gallery", label: "Manage Gallery" },
    { to: "/admin/results", label: "Manage Results" },
  ];

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white transform transition-transform duration-300 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:flex-shrink-0`}
      >
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block py-2 px-4 rounded transition-colors duration-200 hover:bg-blue-700 ${
                  isActive ? "bg-blue-800" : ""
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              className="lg:hidden text-gray-700 focus:outline-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
