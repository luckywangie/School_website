import Hero from "../../components/Hero";
import Loader from "../../components/Loader";
import useFetch from "../../hooks/useFetch";

function Gallery() {
  const { data: gallery, loading, error } = useFetch("gallery");

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero
        title="Our Gallery"
        subtitle="Explore our collection of images showcasing our campus, events, and activities."
        background="/images/gallery-hero.jpg"
      />

      {/* Gallery Section */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto py-12">
        {loading && <Loader />}
        {error && (
          <div className="text-red-500 text-center">
            ⚠️ Failed to load gallery images.
          </div>
        )}

        {!loading && !error && gallery.length === 0 && (
          <div className="text-gray-500 text-center">No images available.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover transform transition duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <p className="text-white text-sm md:text-base font-semibold px-2 text-center">
                  {item.title || "Untitled"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
