// src/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Academics from "./pages/public/Academics";
import Departments from "./pages/public/Departments";
import News from "./pages/public/News";
import Gallery from "./pages/public/Gallery";
import Tenders from "./pages/public/Tenders";
import Contact from "./pages/public/Contact";
import Results from "./pages/public/Results";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ManagePages from "./pages/admin/ManagePages";
import ManageNews from "./pages/admin/ManageNews";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageDepartments from "./pages/admin/ManageDepartments";
import ManageStaff from "./pages/admin/ManageStaff";
import ManageResults from "./pages/admin/ManageResults";
import ManageTenders from "./pages/admin/ManageTenders";
import Messages from "./pages/admin/Messages";

// Auth
import Login from "./pages/auth/Login";

// Optional 404 Page
import NotFound from "./pages/public/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/news" element={<News />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/tenders" element={<Tenders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/results" element={<Results />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pages" element={<ManagePages />} />
        <Route path="news" element={<ManageNews />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="departments" element={<ManageDepartments />} />
        <Route path="staff" element={<ManageStaff />} />
        <Route path="results" element={<ManageResults />} />
        <Route path="tenders" element={<ManageTenders />} />
        <Route path="messages" element={<Messages />} />
      </Route>

      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
