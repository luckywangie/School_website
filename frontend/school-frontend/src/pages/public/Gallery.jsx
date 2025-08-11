// src/pages/Gallery.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      const res = await axios.get("/api/gallery/");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle file select + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUrl("");
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Handle URL change
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null);
    setPreview(e.target.value || null);
  };

  // Upload new image
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!imageFile && !imageUrl) {
      alert("Please provide a file or an image URL");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      if (imageFile) {
        formData.append("file", imageFile);
      } else {
        formData.append("image_url", imageUrl);
      }

      await axios.post("/api/gallery/", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setImageFile(null);
      setImageUrl("");
      setPreview(null);
      fetchGallery();
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await axios.delete(`/api/gallery/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Gallery</h1>

      {token && (
        <form
          onSubmit={handleUpload}
          className="mb-10 bg-white shadow rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-700">Add New Image</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1"
            />
            <span className="text-gray-500">OR</span>
            <input
              type="url"
              placeholder="Image URL"
              value={imageUrl}
              onChange={handleUrlChange}
              className="flex-1 border p-2 rounded"
            />
          </div>

          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded shadow"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-gray-600">No images in the gallery yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <span className="text-gray-500 text-sm">
                  {new Date(item.uploaded_at).toLocaleDateString()}
                </span>
                {token && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="mt-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
