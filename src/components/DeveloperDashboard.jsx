import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../../utils/urlConfing"; // adjust path

const DeveloperDashboard = () => {
  const [stats, setStats] = useState({
    completed: 0,
    active: 0,
    newTasks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${backend_url}/developer/stats`);
        setStats(response.data); // expecting { completed, active, newTasks }
      } catch (error) {
        console.error("Error fetching developer stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Card style array for gradient backgrounds
  const cardStyles = [
    "from-green-100 to-green-300",
    "from-yellow-100 to-yellow-300",
    "from-blue-100 to-blue-300",
  ];

  const cardTitles = ["Completed Tasks", "Active Tasks", "New Tasks"];
  const cardValues = [stats.completed, stats.active, stats.newTasks];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cardTitles.map((title, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${cardStyles[index]} shadow-2xl rounded-xl p-8 flex flex-col items-center justify-center transform hover:scale-105 transition-transform`}
          style={{ minHeight: "180px" }} // increased height
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
          <p className="text-4xl font-bold text-gray-900">
            {loading ? "..." : cardValues[index]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DeveloperDashboard;
