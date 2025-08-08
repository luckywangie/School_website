import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../../services/api";

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", head: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getItems("departments");
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateItem("departments", editingId, formData);
    } else {
      await createItem("departments", formData);
    }
    setFormData({ name: "", head: "" });
    setEditingId(null);
    setShowForm(false);
    fetchDepartments();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, head: item.head });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await deleteItem("departments", id);
      fetchDepartments();
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Departments</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: "", head: "" });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Department
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading departments...</p>
      ) : departments.length === 0 ? (
        <p className="text-gray-500">No departments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Department Name</th>
                <th className="border px-4 py-2">Head</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="border px-4 py-2 font-medium">{item.name}</td>
                  <td className="border px-4 py-2">{item.head || "—"}</td>
                  <td className="border px-4 py-2 space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      aria-label="Edit department"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      aria-label="Delete department"
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
              {editingId ? "Edit Department" : "Add Department"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Department Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border rounded px-4 py-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Head of Department"
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                className="border rounded px-4 py-2 w-full"
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

export default ManageDepartments;
