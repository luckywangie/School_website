import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../../services/api";

function ManageTenders() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const data = await getItems("tenders");
      setTenders(data);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateItem("tenders", editingId, formData);
      setEditingId(null);
    } else {
      await createItem("tenders", formData);
    }
    setFormData({ title: "", description: "" });
    fetchTenders();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tender?")) {
      await deleteItem("tenders", id);
      fetchTenders();
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Tenders</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Tender Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border rounded px-4 py-2 w-full"
          required
        />
        <textarea
          placeholder="Tender Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border rounded px-4 py-2 w-full"
          rows={4}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Tender" : "Add Tender"}
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading tenders...</p>
      ) : tenders.length === 0 ? (
        <p className="text-gray-500">No tenders found.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenders.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.title}</td>
                <td className="border px-4 py-2 max-w-xs truncate">{item.description}</td>
                <td className="border px-4 py-2 space-x-2">
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
      )}
    </div>
  );
}

export default ManageTenders;
