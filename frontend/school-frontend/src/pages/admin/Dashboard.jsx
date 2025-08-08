import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    newsCount: 0,
    tendersCount: 0,
    staffCount: 0,
    messagesCount: 0,
  });

  useEffect(() => {
    // Simulate fetching stats from backend
    const timeout = setTimeout(() => {
      setStats({
        newsCount: 12,
        tendersCount: 5,
        staffCount: 18,
        messagesCount: 7,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const cards = [
    { title: "News", value: stats.newsCount, color: "bg-blue-500" },
    { title: "Tenders", value: stats.tendersCount, color: "bg-green-500" },
    { title: "Staff", value: stats.staffCount, color: "bg-purple-500" },
    { title: "Messages", value: stats.messagesCount, color: "bg-yellow-500" },
  ];

  const barData = [
    { name: "News", count: stats.newsCount },
    { name: "Tenders", count: stats.tendersCount },
  ];

  const pieData = [
    { name: "Staff", value: stats.staffCount },
    { name: "Messages", value: stats.messagesCount },
  ];

  const COLORS = ["#8B5CF6", "#FACC15"]; // Purple & Yellow

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} text-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105`}
          >
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="text-4xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">News & Tenders Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Staff vs Messages</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
