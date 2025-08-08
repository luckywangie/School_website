import { useEffect, useState } from "react";
import Hero from "../../components/Hero";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import useFetch from "../../hooks/useFetch";

function Home() {
  const { data: news, loading: newsLoading } = useFetch("news");
  const { data: gallery, loading: galleryLoading } = useFetch("gallery");

  // Only take first 3 items for preview
  const latestNews = news?.slice(0, 3) || [];
  const latestGallery = gallery?.slice(0, 4) || [];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero
        title="Welcome to Our School"
        subtitle="Empowering Students, Building the Future"
        background="/images/school-hero.jpg"
      />

      {/* Latest News */}
      <section className="px-6 md:px-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Latest News</h2>
        {newsLoading ? (
          <Loader />
        ) : latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((item) => (
              <Card
                key={item.id}
                image={item.imageUrl || "/images/news-placeholder.jpg"}
                title={item.title}
                description={item.content}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No news available.</p>
        )}
      </section>

      {/* Gallery Highlights */}
      <section className="px-6 md:px-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Gallery Highlights</h2>
        {galleryLoading ? (
          <Loader />
        ) : latestGallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestGallery.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-lg shadow">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No gallery items available.</p>
        )}
      </section>
    </div>
  );
}

export default Home;
