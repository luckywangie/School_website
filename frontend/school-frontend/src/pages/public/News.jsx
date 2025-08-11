import { useState, useEffect } from "react";
import Hero from "../../components/Hero";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import useFetch from "../../hooks/useFetch";
import api from "../../services/api"; // axios instance

function News() {
  const { data: newsData, loading, error } = useFetch("news");
  const [selectedNews, setSelectedNews] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    if (Array.isArray(newsData)) {
      setNews(newsData);
    }
  }, [newsData]);

  // Load full news content when opening modal
  const openNews = async (item) => {
    try {
      const res = await api.get(`/news/${item.id}`);
      setSelectedNews(res.data);
    } catch (err) {
      console.error("Failed to fetch full news:", err);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero
        title="Latest News"
        subtitle="Stay updated with the latest events and announcements from our institution."
        background="/images/news-hero.jpg"
      />

      {/* News Section */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto py-12">
        {loading && <Loader />}
        {error && (
          <div className="text-red-500 text-center">
            ⚠️ Failed to load news.
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="text-gray-500 text-center">No news available.</div>
        )}

        {/* News Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(news || []).map((item) => (
            <Card
              key={item.id}
              title={item.title || "Untitled"}
              description={
                item.description
                  ? item.description.length > 100
                    ? item.description.slice(0, 100) + "..."
                    : item.description
                  : "No description available."
              }
              image={item.image_url || "/images/default-news.jpg"}
              buttonText="Read More"
              onClick={() => openNews(item)}
            />
          ))}
        </div>
      </div>

      {/* Modal for Full News */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {selectedNews.title || "Untitled"}
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {selectedNews.content || selectedNews.description || "No content available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default News;
