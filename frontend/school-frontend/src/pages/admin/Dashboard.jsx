import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/news"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">News Management</h3>
          <p className="text-gray-600">Create, edit, and delete news articles</p>
        </Link>
        
        <Link
          to="/admin/gallery"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Gallery</h3>
          <p className="text-gray-600">Manage gallery images</p>
        </Link>
        
        <Link
          to="/admin/staff"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Staff</h3>
          <p className="text-gray-600">Manage staff members</p>
        </Link>
        
        <Link
          to="/admin/results"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Results</h3>
          <p className="text-gray-600">Manage exam results</p>
        </Link>
        
        <Link
          to="/admin/tenders"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tenders</h3>
          <p className="text-gray-600">Manage tender notices</p>
        </Link>
        
        <Link
          to="/admin/messages"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages</h3>
          <p className="text-gray-600">View contact messages</p>
        </Link>
      </div>
    </div>
  );
}
