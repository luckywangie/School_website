import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "/api/results";
const RESULTS_PER_PAGE = 5;

export default function ManageResults() {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    student_name: "",
    class_name: "",
    year: "",
    score: "",
    pdf: null,
  });
  const [editing, setEditing] = useState(false);
  const [filterClass, setFilterClass] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchResults = async () => {
    try {
      const res = await axios.get(API_URL);
      setResults(res.data);
      setFilteredResults(res.data);
    } catch (err) {
      console.error("Failed to fetch results", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    filterAndPaginate();
  }, [results, filterClass, filterYear, currentPage]);

  const filterAndPaginate = () => {
    let filtered = results;

    if (filterClass) {
      filtered = filtered.filter((r) => r.class_name === filterClass);
    }
    if (filterYear) {
      filtered = filtered.filter((r) => r.year === filterYear);
    }

    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    setFilteredResults(filtered.slice(start, end));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      setFormData({ ...formData, pdf: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      if (editing) {
        await axios.put(`${API_URL}/${formData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchResults();
      setFormData({ id: null, student_name: "", class_name: "", year: "", score: "", pdf: null });
      setEditing(false);
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  const handleEdit = (result) => {
    setFormData({
      id: result.id,
      student_name: result.student_name,
      class_name: result.class_name,
      year: result.year,
      score: result.score,
      pdf: null,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this result?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchResults();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const totalPages = Math.ceil(
    results.filter(
      (r) =>
        (!filterClass || r.class_name === filterClass) &&
        (!filterYear || r.year === filterYear)
    ).length / RESULTS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{editing ? "Edit Result" : "Add New Result"}</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="student_name"
            placeholder="Student Name"
            value={formData.student_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="class_name"
            placeholder="Class Name"
            value={formData.class_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="score"
            placeholder="Score"
            value={formData.score}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <input
            type="file"
            name="pdf"
            onChange={handleChange}
            className="border p-2 rounded"
            accept=".pdf"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Update Result" : "Add Result"}
        </button>
      </form>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Class"
          value={filterClass}
          onChange={(e) => {
            setFilterClass(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Filter by Year"
          value={filterYear}
          onChange={(e) => {
            setFilterYear(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Results */}
      <h2 className="text-xl font-semibold mb-2">All Results</h2>
      <div className="grid gap-4">
        {filteredResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          filteredResults.map((res) => (
            <div
              key={res.id}
              className="bg-gray-50 border p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="space-y-1">
                <p><strong>Name:</strong> {res.student_name}</p>
                <p><strong>Class:</strong> {res.class_name}</p>
                <p><strong>Year:</strong> {res.year}</p>
                <p><strong>Score:</strong> {res.score}</p>
                {res.pdf_url && (
                  <a
                    href={res.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View PDF
                  </a>
                )}
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <button
                  onClick={() => handleEdit(res)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-800"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
