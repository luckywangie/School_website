import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../../services/api";

function ManagePages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await getItems("pages");
      setPages(data);
    } catch (err) {
      console.error("Error fetching pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateItem("pages", editingId, formData);
    } else {
      await createItem("pages", formData);
    }
    setFormData({ title: "", content: "" });
    setEditingId(null);
    setShowForm(false);
    fetchPages();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, content: item.content });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      await deleteItem("pages", id);
      fetchPages();
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Pages</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ title: "", content: "" });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Page
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading pages...</p>
      ) : pages.length === 0 ? (
        <p className="text-gray-500">No pages found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Content</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="border px-4 py-2 font-medium">{item.title}</td>
                  <td className="border px-4 py-2 max-w-xs truncate">{item.content}</td>
                  <td className="border px-4 py-2 space-x-2 text-center">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Page" : "Add Page"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Page Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border rounded px-4 py-2 w-full"
                required
              />
              <textarea
                placeholder="Page Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="border rounded px-4 py-2 w-full"
                rows={5}
                required
              />
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

export default ManagePages;
