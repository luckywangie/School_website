import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/results";

export default function ResultsManagement() {
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({
    student_name: "",
    class_name: "",
    year: "",
    image_url: "",
    file: null,
  });

  const token = localStorage.getItem("token");

  // Fetch all results
  const fetchResults = async () => {
    try {
      const res = await axios.get(API_URL + "/");
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      alert("Please select a PDF file");
      return;
    }
    const data = new FormData();
    data.append("file", form.file);
    data.append("student_name", form.student_name);
    data.append("class_name", form.class_name);
    data.append("year", form.year);
    data.append("image_url", form.image_url);

    try {
      await axios.post(API_URL + "/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setForm({
        student_name: "",
        class_name: "",
        year: "",
        image_url: "",
        file: null,
      });
      fetchResults();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Results Management</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-4 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Upload Result</h2>
        <input
          name="student_name"
          value={form.student_name}
          onChange={handleChange}
          placeholder="Student Name"
          className="border rounded w-full p-2 mb-3"
          required
        />
        <input
          name="class_name"
          value={form.class_name}
          onChange={handleChange}
          placeholder="Class Name"
          className="border rounded w-full p-2 mb-3"
          required
        />
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
          type="number"
          className="border rounded w-full p-2 mb-3"
        />
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Optional Preview Image URL"
          className="border rounded w-full p-2 mb-3"
        />
        <input
          name="file"
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="border rounded w-full p-2 mb-3"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload PDF
        </button>
      </form>

      {/* Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((r) => (
          <div
            key={r.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            {r.image_url && (
              <img
                src={r.image_url}
                alt="Result preview"
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg">{r.student_name}</h3>
              <p className="text-gray-600">
                {r.class_name} - {r.year}
              </p>
              {r.pdf_url && (
                <a
                  href={`http://localhost:5000${r.pdf_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
