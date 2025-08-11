import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Images,
  FileText,
  Building,
  BarChart3,
  Users, // ✅ Icon for Staff
} from "lucide-react";

export default function UserDashboard() {
  const { user } = useContext(UserContext);

  const quickLinks = [
    { path: "/news", label: "Latest News", icon: Newspaper, color: "bg-blue-500" },
    { path: "/gallery", label: "Gallery", icon: Images, color: "bg-green-500" },
    { path: "/tenders", label: "Tenders", icon: FileText, color: "bg-yellow-500" },
    { path: "/departments", label: "Departments", icon: Building, color: "bg-purple-500" },
    { path: "/results", label: "Results", icon: BarChart3, color: "bg-red-500" },
    { path: "/staff/teachers", label: "Staff", icon: Users, color: "bg-pink-500" }, // ✅ New Staff link
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-gray-600">
          Access your dashboard to explore news, gallery, tenders, departments, results, and staff information.
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map(({ path, label, icon: Icon, color }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center h-40 rounded-2xl shadow-md text-white ${color} transition-transform hover:scale-105`}
          >
            <Icon size={40} className="mb-3" />
            <span className="font-semibold text-lg">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
