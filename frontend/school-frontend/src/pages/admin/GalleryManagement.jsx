import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/gallery";

export default function GalleryManagement() {
  const [gallery, setGallery] = useState([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      const res = await axios.get(API_URL);
      setGallery(res.data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    if (imageFile) {
      formData.append("file", imageFile);
    } else if (imageUrl) {
      formData.append("image_url", imageUrl);
    }

    try {
      await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
        },
      });
      setTitle("");
      setImageFile(null);
      setImageUrl("");
      fetchGallery();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchGallery();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gallery Management</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Image</h2>

        <input
          type="text"
          placeholder="Image Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded w-full p-2 mb-3"
        />

        <div className="flex gap-4 mb-3">
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border rounded p-2"
          />
          <span className="text-gray-500">OR</span>
          <input
            type="url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Gallery List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img
              src={`http://localhost:5000${item.image_url}`}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-500 text-sm">
                Uploaded: {new Date(item.uploaded_at).toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(item.id)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
