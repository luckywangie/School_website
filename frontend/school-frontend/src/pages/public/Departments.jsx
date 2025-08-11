import { useEffect, useState } from "react";
import Hero from "../../components/Hero";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import useFetch from "../../hooks/useFetch";

function Departments() {
  // Fetch departments from backend
  const { data: departments, loading } = useFetch("departments");

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero
        title="Our Departments"
        subtitle="Explore our academic departments and dedicated staff"
        background="/images/departments-hero.jpg"
      />

      {/* Departments List */}
      <section className="px-6 md:px-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Departments</h2>
        {loading ? (
          <Loader />
        ) : departments && departments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <Card
                key={dept.id}
                image={dept.image_url || "/images/department-placeholder.jpg"}
                title={dept.name}
                description={
                  dept.description?.length > 100
                    ? dept.description.slice(0, 100) + "..."
                    : dept.description || "No description available."
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No departments available.</p>
        )}
      </section>
    </div>
  );
}

export default Departments;
