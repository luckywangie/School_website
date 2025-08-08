import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import Hero from "../../components/Hero";

export default function DepartmentStaff() {
  const { id } = useParams();
  const { data: department, loading, error } = useFetch(`academics/departments/${id}`);

  return (
    <div className="space-y-12">
      <Hero
        title={department?.name || "Department Staff"}
        subtitle={department?.description || "Meet our dedicated staff."}
        background="/images/staff-hero.jpg"
      />

      <div className="px-6 md:px-16 max-w-7xl mx-auto py-12">
        {loading && <Loader />}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {!loading && !error && department?.staff?.length === 0 && (
          <div className="text-gray-500 text-center">No staff found for this department.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {department?.staff?.map((member) => (
            <div
              key={member.id}
              className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-xl transition"
            >
              <img
                src={member.photo_url || "/images/placeholder-staff.jpg"}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
