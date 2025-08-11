import { useState, useEffect } from "react";
import Hero from "../../components/Hero";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import axios from "axios";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/results")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setResults([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
        setError("Failed to load results. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Hero title="Exam Results" />
      <section className="px-4 py-8 md:px-20">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-600">No results available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((result) => (
              <Card
                key={result.id}
                image={result.image_url}
                title={result.student_name}
                subtitle={`Class: ${result.class_name} | Year: ${result.year}`}
                link={result.pdf_url ? result.pdf_url : "#"}
                linkText="Download PDF"
                // Optional: Open link in new tab
                target="_blank"
                rel="noopener noreferrer"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
