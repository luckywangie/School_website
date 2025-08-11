import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaBuilding, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const API_CONTACT = "http://localhost:5000/api/contact/";
const API_DEPT = "http://localhost:5000/api/departments/";

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: "", description: "", image_url: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all messages & departments
  const fetchData = async () => {
    try {
      const [msgRes, depRes] = await Promise.all([
        axios.get(API_CONTACT),
        axios.get(API_DEPT),
      ]);
      setMessages(msgRes.data);
      setDepartments(depRes.data);
    } catch (err) {
      toast.error("Error fetching data");
    }
  };

  // Create department
  const createDepartment = async () => {
    if (!newDept.name.trim()) return toast.warning("Name is required");
    try {
      await axios.post(API_DEPT, newDept, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Department created");
      setNewDept({ name: "", description: "", image_url: "" });
      fetchData();
    } catch {
      toast.error("Error creating department");
    }
  };

  // Delete department
  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await axios.delete(API_DEPT + id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Department deleted");
      fetchData();
    } catch {
      toast.error("Error deleting department");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<FaEnvelope />}
          label="Total Messages"
          value={messages.length}
          color="bg-blue-500"
        />
        <StatCard
          icon={<FaBuilding />}
          label="Departments"
          value={departments.length}
          color="bg-green-500"
        />
        <StatCard
          icon="📩"
          label="Last Message"
          value={messages[0]?.subject || "No messages"}
          color="bg-purple-500"
        />
      </div>

      {/* Messages Section */}
      <Section title="Recent Messages">
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {messages.length ? (
            messages.map((m) => (
              <div key={m.id} className="border-b pb-2">
                <p className="font-semibold text-gray-800">
                  {m.name} <span className="text-sm text-gray-500">({m.email})</span>
                </p>
                <p className="text-sm text-gray-500">{m.subject}</p>
                <p>{m.message}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No messages found</p>
          )}
        </div>
      </Section>

      {/* Departments Management */}
      <Section title="Manage Departments">
        {/* New department form */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            placeholder="Name"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            className="border rounded p-2 flex-1"
          />
          <input
            placeholder="Description"
            value={newDept.description}
            onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
            className="border rounded p-2 flex-1"
          />
          <input
            placeholder="Image URL"
            value={newDept.image_url}
            onChange={(e) => setNewDept({ ...newDept, image_url: e.target.value })}
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={createDepartment}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>

        {/* Department list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.length ? (
            departments.map((d) => (
              <div
                key={d.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={d.image_url}
                  alt={d.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{d.name}</h3>
                  <p className="text-gray-600 text-sm">{d.description}</p>
                  <p className="text-xs text-gray-500">Staff: {d.staff_count}</p>
                  <button
                    onClick={() => deleteDepartment(d.id)}
                    className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-gray-500 italic">No departments found</p>
          )}
        </div>
      </Section>
    </div>
  );
}

// Reusable Stat Card
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`${color} text-white p-6 rounded-lg shadow flex flex-col`}>
      <div className="flex items-center gap-3 text-lg font-semibold">
        {icon} {label}
      </div>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

// Reusable Section Wrapper
function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
