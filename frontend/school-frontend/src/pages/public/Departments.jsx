import Hero from "../../components/Hero";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";

function Departments() {
  // ✅ Remove 'api/' prefix to avoid double API
  const { data: departments = [], loading, error } = useFetch("academics/departments");

  return (
    <div className="space-y-12">
      <Hero
        title="Our Departments"
        subtitle="Explore our academic departments."
        background="/images/departments-hero.jpg"
      />

      <div className="px-6 md:px-16 max-w-7xl mx-auto py-12">
        {loading && <Loader />}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {!loading && !error && departments.length === 0 && (
          <div className="text-gray-500 text-center">No departments available.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-4 shadow-lg border rounded-lg">
              <img
                src={dept.image_url || "/images/placeholder-dept.jpg"}
                alt={dept.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
              <p className="text-gray-700 text-sm mb-4">
                {dept.description || "No description available."}
              </p>
              <Link
                to={`/departments/${dept.id}/staff`}
                className="text-blue-500 hover:underline"
              >
                View Staff →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Departments;
