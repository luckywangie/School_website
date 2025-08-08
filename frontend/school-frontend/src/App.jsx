import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";

// ✅ Lazy load Admin Pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Messages = lazy(() => import("./pages/admin/Messages"));
const ManageNews = lazy(() => import("./pages/admin/ManageNews"));
const ManageTenders = lazy(() => import("./pages/admin/ManageTenders"));
const ManageDepartments = lazy(() => import("./pages/admin/ManageDepartments"));
const ManageStaff = lazy(() => import("./pages/admin/ManageStaff"));
const ManagePages = lazy(() => import("./pages/admin/ManagePages"));
const ManageGallery = lazy(() => import("./pages/admin/ManageGallery"));
const ManageResults = lazy(() => import("./pages/admin/ManageResults"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

// ✅ Lazy load Public Pages
const Home = lazy(() => import("./pages/public/Home"));
const About = lazy(() => import("./pages/public/About"));
const Academics = lazy(() => import("./pages/public/Academics"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Departments = lazy(() => import("./pages/public/Departments"));
const Gallery = lazy(() => import("./pages/public/Gallery"));
const News = lazy(() => import("./pages/public/News"));
const Tenders = lazy(() => import("./pages/public/Tenders"));
const UserDashboard = lazy(() => import("./pages/public/UserDashboard"));
const Results = lazy(() => import("./pages/public/Results")); // ✅ ← MISSING before

// ✅ Lazy load Staff Subpages
const Teachers = lazy(() => import("./pages/Staff/Teachers"));
const Support = lazy(() => import("./pages/Staff/Support"));
const AdminTeam = lazy(() => import("./pages/Staff/Admin")); // renamed to AdminTeam

// ✅ Lazy load Dynamic Department Staff Page
const DepartmentStaff = lazy(() => import("./pages/public/DepartmentStaff"));

// ✅ Protected Route for Admin
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <UserProvider>
      <AdminProvider>
        <Router>
          <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <Routes>
              {/* ---------- PUBLIC ROUTES WITH LAYOUT ---------- */}
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
                <Route path="/results" element={<Results />} /> {/* ✅ ADDED PUBLIC RESULTS PAGE */}

                {/* Static Staff Dropdown Pages */}
                <Route path="/staff/teachers" element={<Teachers />} />
                <Route path="/staff/support" element={<Support />} />
                <Route path="/staff/admin" element={<AdminTeam />} />
              </Route>

              {/* ---------- ADMIN ROUTES ---------- */}
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="messages" element={<Messages />} />
                <Route path="news" element={<ManageNews />} />
                <Route path="tenders" element={<ManageTenders />} />
                <Route path="departments" element={<ManageDepartments />} />
                <Route path="staff" element={<ManageStaff />} />
                <Route path="pages" element={<ManagePages />} />
                <Route path="gallery" element={<ManageGallery />} />
                <Route path="results" element={<ManageResults />} />
              </Route>

              {/* ---------- FALLBACK ---------- */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AdminProvider>
    </UserProvider>
  );
}
