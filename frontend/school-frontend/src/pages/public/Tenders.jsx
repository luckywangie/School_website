import { useState } from "react";
import Hero from "../../components/Hero";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import useFetch from "../../hooks/useFetch";

function Tenders() {
  const { data: tenders, loading, error } = useFetch("tenders");
  const [selectedTender, setSelectedTender] = useState(null);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero
        title="Current Tenders"
        subtitle="Explore our latest tenders and opportunities to partner with us."
        background="/images/tenders-hero.jpg"
      />

      {/* Tenders Section */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto py-12">
        {loading && <Loader />}
        {error && (
          <div className="text-red-500 text-center">
            ⚠️ Failed to load tenders.
          </div>
        )}

        {!loading && !error && tenders.length === 0 && (
          <div className="text-gray-500 text-center">No tenders available.</div>
        )}

        {/* Tender Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenders.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              description={
                item.description.length > 100
                  ? item.description.slice(0, 100) + "..."
                  : item.description
              }
              image={item.imageUrl || "/images/default-tender.jpg"}
              buttonText="View Details"
              onClick={() => setSelectedTender(item)}
            />
          ))}
        </div>
      </div>

      {/* Modal for Full Tender Details */}
      {selectedTender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedTender(null)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedTender.title}</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {selectedTender.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tenders;
