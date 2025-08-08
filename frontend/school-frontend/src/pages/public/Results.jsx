import { useState, useEffect } from "react";
import Hero from "../../components/Hero";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import axios from "axios";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/results")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else if (Array.isArray(response.data.results)) {
          setResults(response.data.results);
        } else {
          console.error("Unexpected data format:", response.data);
          setResults([]); // Prevent .map error
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching results:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Hero title="Exam Results" />
      <section className="px-4 py-8 md:px-20">
        {loading ? (
          <Loader />
        ) : results.length === 0 ? (
          <p className="text-center text-gray-600">No results available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((result) => (
              <Card
                key={result.id}
                title={result.student_name}
                subtitle={`Class: ${result.class_name} | Year: ${result.year}`}
                content={`Score: ${result.score}`}
                link={result.pdf_url || "#"}
                linkText="Download Result"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
