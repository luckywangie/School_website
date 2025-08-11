// src/pages/staff/StaffProfile.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function StaffProfile() {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/staff/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch staff details");
        return res.json();
      })
      .then((data) => {
        setStaff(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading staff profile...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!staff) return <div className="text-center py-10">No staff found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link to="/staff/teachers" className="text-blue-600 hover:underline">
          ← Back to Staff List
        </Link>
      </div>

      {/* Staff Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
        <img
          src={staff.photo_url || "/static/images/placeholder.png"}
          alt={staff.name}
          className="w-48 h-48 object-cover rounded-xl border"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{staff.name}</h1>
          <p className="text-lg text-gray-600 mb-2">{staff.title}</p>

          {staff.department && (
            <p className="mb-4">
              <span className="font-semibold">Department:</span>{" "}
              <Link
                to={`/departments/${staff.department.id}`}
                className="text-blue-600 hover:underline"
              >
                {staff.department.name}
              </Link>
            </p>
          )}

          <p className="text-gray-700 whitespace-pre-line">{staff.bio}</p>
        </div>
      </div>
    </div>
  );
}
