import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../../utils/urlConfing";
import { useParams } from "react-router-dom";
import { User } from "lucide-react";
import { FaRegUserCircle } from 'react-icons/fa'


const CompletedTasks = () => {
  const { id } = useParams(); // developer ID
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Developer" });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get(
          `${backend_url}/api/get-completed-tasks?page=${page}&limit=5`,
          { headers: { Authorization: token } }
        );
        const { data, totalPages } = response.data;
        setTasks(data || []);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/developer/${id}`, {
          headers: { Authorization: token },
        });
        setUser(response.data?.data || { name: "Developer" });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchCompletedTasks();
    fetchUserProfile();
  }, [id, page]);

  // Add comment
  const handleAddComment = async (taskId) => {
    const comment = prompt("Enter your comment:");
    if (!comment) return;

    try {
      await axios.post(
        `${backend_url}/api/add-comment/${taskId}`,
        { comment },
        { headers: { Authorization: token } }
      );
      alert("Comment added successfully");
      setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, comment } : t));
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 mb-8">
      <h1 className="text-2xl font-bold text-blue-600">Project Management</h1>
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <FaRegUserCircle className="text-gray-600 text-2xl" />
        </div>
        <span className="font-medium text-gray-700">{name}</span>
      </div>
    </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Completed Tasks</h2>

        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No completed tasks available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li
                key={task.task_id}
                className="py-4 px-3 hover:bg-gray-100 transition-all rounded-lg flex flex-col"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="font-semibold text-gray-700">Task ID:</div>
                  <div className="text-gray-800">{task.task_id}</div>

                  <div className="font-semibold text-gray-700">Title:</div>
                  <div className="text-gray-800">{task.title}</div>

                  <div className="font-semibold text-gray-700">Project:</div>
                  <div className="text-gray-800">{task.project_name}</div>

                  <div className="font-semibold text-gray-700">Assigned By:</div>
                  <div className="text-gray-800">{task.assigned_by_name}</div>

                  <div className="font-semibold text-gray-700">Status:</div>
                  <div className="text-gray-800 capitalize">{task.status}</div>

                  <div className="font-semibold text-gray-700">Comment:</div>
                  <div className="text-gray-800">{task.comment || "No comment"}</div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleAddComment(task.task_id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                  >
                    Add Comment
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 py-2">{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;
