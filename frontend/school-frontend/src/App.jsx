import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Lazy loaded public pages
const Home = lazy(() => import("./pages/public/Home"));
const About = lazy(() => import("./pages/public/About"));
const Academics = lazy(() => import("./pages/public/Academics"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Departments = lazy(() => import("./pages/public/Departments"));
const Gallery = lazy(() => import("./pages/public/Gallery"));
const News = lazy(() => import("./pages/public/News"));
const Tenders = lazy(() => import("./pages/public/Tenders"));
const UserDashboard = lazy(() => import("./pages/public/UserDashboard"));
const Results = lazy(() => import("./pages/public/Results"));

// Lazy loaded auth pages
const Login = lazy(() => import("./pages/auth/Login"));

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import("./pages/Staff/Admin"));
const Teachers = lazy(() => import("./pages/Staff/Teachers"));
const Support = lazy(() => import("./pages/Staff/Support"));
const AdminTeam = lazy(() => import("./pages/Staff/Admin"));
const DepartmentStaff = lazy(() => import("./pages/public/DepartmentStaff"));
const StaffProfile = lazy(() => import("./pages/Staff/StaffProfile"));

export default function App() {
  return (
    <UserProvider>
      <AdminProvider>
        <Router>
          <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/academics" element={<Academics />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/departments/:id/staff" element={<DepartmentStaff />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/news" element={<News />} />
                <Route path="/tenders" element={<Tenders />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/results" element={<Results />} />
                <Route path="/staff/teachers" element={<Teachers />} />
                <Route path="/staff/support" element={<Support />} />
                <Route path="/staff/admin" element={<AdminTeam />} />
                <Route path="/staff/:id" element={<StaffProfile />} />
              </Route>

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />

              {/* Admin Routes */}
              <Route element={<ProtectedAdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/news" element={<div>News Management</div>} />
                  <Route path="/admin/gallery" element={<div>Gallery Management</div>} />
                  <Route path="/admin/staff" element={<div>Staff Management</div>} />
                  <Route path="/admin/results" element={<div>Results Management</div>} />
                  <Route path="/admin/tenders" element={<div>Tenders Management</div>} />
                  <Route path="/admin/messages" element={<div>Messages Management</div>} />
                </Route>
              </Route>

              {/* Fallback to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AdminProvider>
    </UserProvider>
  );
}
