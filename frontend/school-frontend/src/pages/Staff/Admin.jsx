import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

export default function Admin() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/staff")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch staff");
        return res.json();
      })
      .then((data) => {
        // Filter for Admin team by title or department_id if you want
        const adminStaff = data.filter((s) => s.title?.toLowerCase().includes("admin"));
        setStaff(adminStaff);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Admin Team</h1>
      <p className="text-gray-700 mb-8">Meet the administrators who keep things running smoothly.</p>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : staff.length === 0 ? (
        <p className="text-gray-600">No admin staff found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {staff.map((member) => (
            <Link
              key={member.id}
              to={`/staff/${member.id}`}
              className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-xl transition block"
            >
              <img
                src={member.photo_url || "/images/placeholder-staff.jpg"}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
