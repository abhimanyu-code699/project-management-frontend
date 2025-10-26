import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../../utils/urlConfing"; 
import { useNavigate } from "react-router-dom"; // ✅ import navigate

const DeveloperDashboard = () => {
  const [stats, setStats] = useState({
    completed: 0,
    active: 0,
    newTasks: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ navigation hook

  // Assuming user info stored in sessionStorage (or JWT decode if you prefer)
  const developerId = sessionStorage.getItem("id"); // ensure you store this during login

  useEffect(() => {
    const fetchStats = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(`${backend_url}/api/tasks-stats`, {
          headers: { Authorization: `${token}` },
        });
        const { data } = response.data;

        setStats({
          completed: Number(data.totalCompleted) || 0,
          active: Number(data.totalInProgress) || 0,
          newTasks: Number(data.totalTodo) || 0,
        });
      } catch (error) {
        console.error("Error fetching developer stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardStyles = [
    "from-green-100 to-green-300",
    "from-yellow-100 to-yellow-300",
    "from-blue-100 to-blue-300",
  ];

  const cardTitles = ["Completed Tasks", "Active Tasks", "New Tasks"];
  const cardKeys = ["completed-tasks", "active-tasks", "new-tasks"];
  const cardValues = [stats.completed, stats.active, stats.newTasks];

  // ✅ Handle click on card
  const handleCardClick = (taskKey) => {
    if (!developerId) {
      console.error("Developer ID not found in sessionStorage");
      return;
    }
    navigate(`/developer/${developerId}/${taskKey}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cardTitles.map((title, index) => (
        <div
          key={index}
          onClick={() => handleCardClick(cardKeys[index])}
          className={`bg-gradient-to-br ${cardStyles[index]} shadow-2xl rounded-xl p-8 flex flex-col items-center justify-center transform hover:scale-105 transition-transform cursor-pointer`} // ✅ pointer
          style={{ minHeight: "180px" }}
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
