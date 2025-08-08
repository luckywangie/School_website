import { useEffect, useState } from "react";
import api from "../../services/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null); // For reply modal
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch messages from backend
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/messages");
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter((msg) => msg.id !== id));
    }
  };

  // Toggle read/unread
  const toggleReadStatus = async (id, currentStatus) => {
    await api.put(`/messages/${id}`, { read: !currentStatus });
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, read: !currentStatus } : msg
      )
    );
  };

  // Handle reply submission
  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return alert("Reply cannot be empty");

    // Simulate sending reply (replace with your API)
    await api.post(`/messages/${selectedMessage.id}/reply`, { reply });
    alert("Reply sent successfully!");

    setReply("");
    setSelectedMessage(null);
  };

  // Filter messages based on search
  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6 text-gray-600">Loading messages...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-3xl font-bold">Messages</h1>
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Messages Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Message</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50 transition">
                  <td className="border px-4 py-2">{msg.name}</td>
                  <td className="border px-4 py-2">{msg.email}</td>
                  <td className="border px-4 py-2 font-medium">{msg.subject}</td>
                  <td className="border px-4 py-2">{msg.message}</td>
                  <td className="border px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        msg.read ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {msg.read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => toggleReadStatus(msg.id, msg.read)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      {msg.read ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Reply to {selectedMessage.name}</h2>
            <p className="mb-2 text-sm text-gray-600">{selectedMessage.message}</p>
            <textarea
              rows="4"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              className="w-full border rounded p-2 mb-4 focus:ring focus:ring-blue-300"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
