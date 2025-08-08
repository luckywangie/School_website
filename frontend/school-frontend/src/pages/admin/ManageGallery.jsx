import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../../services/api";

function ManageGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const data = await getItems("gallery");
      setGallery(data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateItem("gallery", editingId, formData);
    } else {
      await createItem("gallery", formData);
    }
    setFormData({ title: "", imageUrl: "" });
    setEditingId(null);
    setShowForm(false);
    fetchGallery();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, imageUrl: item.imageUrl });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      await deleteItem("gallery", id);
      fetchGallery();
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Gallery</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ title: "", imageUrl: "" });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Image
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading gallery...</p>
      ) : gallery.length === 0 ? (
        <p className="text-gray-500">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div key={item.id} className="border rounded-lg shadow overflow-hidden group">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-32 object-cover group-hover:opacity-90 transition"
              />
              <div className="p-2 flex justify-between items-center text-sm">
                <span className="font-semibold truncate">{item.title}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Image" : "Add Image"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Image Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border rounded px-4 py-2 w-full"
                required
              />
              <input
                type="url"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="border rounded px-4 py-2 w-full"
                required
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageGallery;
