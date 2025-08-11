import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tenders";

export default function TenderManagement() {
  const [tenders, setTenders] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    image_url: "",
    file: null,
  });

  const token = localStorage.getItem("token");

  // Fetch all tenders
  const fetchTenders = async () => {
    try {
      const res = await axios.get(API_URL + "/");
      setTenders(res.data);
    } catch (err) {
      console.error("Error fetching tenders:", err);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  // Form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Upload new tender
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      alert("Please select a PDF file");
      return;
    }

    const data = new FormData();
    data.append("file", form.file);
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("deadline", form.deadline);
    data.append("image_url", form.image_url);

    try {
      await axios.post(API_URL + "/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setForm({
        title: "",
        description: "",
        deadline: "",
        image_url: "",
        file: null,
      });
      fetchTenders();
    } catch (err) {
      console.error("Tender upload failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tender Management</h1>

      {/* Upload form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-4 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Upload Tender</h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border rounded w-full p-2 mb-3"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border rounded w-full p-2 mb-3"
          rows="3"
        />
        <input
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          type="date"
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

      {/* Tenders list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tenders.map((t) => (
          <div
            key={t.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            {t.image_url && (
              <img
                src={t.image_url}
                alt="Tender preview"
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg">{t.title}</h3>
              <p className="text-gray-600">{t.description}</p>
              {t.deadline && (
                <p className="text-red-500 mt-1">
                  Deadline: {new Date(t.deadline).toLocaleDateString()}
                </p>
              )}
              {t.document_url && (
                <a
                  href={`http://localhost:5000${t.document_url}`}
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
