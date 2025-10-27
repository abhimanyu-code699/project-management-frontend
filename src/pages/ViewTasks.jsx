import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backend_url } from "../../utils/urlConfing";
import { FaTasks } from "react-icons/fa";

const ViewTasks = () => {
  const { managerId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks for manager
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token"); 
      const response = await axios.get(`${backend_url}/api/view-tasks`, {
        headers: { Authorization: `${token}` },
      });
      const data = response.data.data || [];
      setTasks(data);
      setFilteredTasks(data);

      // Extract unique project names for dropdown
      const uniqueProjects = [
        ...new Set(data.map((task) => task.project_name)),
      ];
      setProjects(uniqueProjects);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [managerId]);

  // Filter logic
  useEffect(() => {
    let filtered = [...tasks];
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.task_status === statusFilter);
    }
    if (projectFilter !== "all") {
      filtered = filtered.filter((task) => task.project_name === projectFilter);
    }
    setFilteredTasks(filtered);
  }, [statusFilter, projectFilter, tasks]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FaTasks /> View All Tasks
        </h2>
        
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="to-do">To-Do</option>
            <option value="in-progress">In-Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Filter by Project
          </label>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            {projects.map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-600">
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No tasks found for this manager.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full border border-gray-200 text-left">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Project</th>
                <th className="px-4 py-2 border">Task Name</th>
                <th className="px-4 py-2 border">Developer</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Completion Date</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr
                  key={task.task_id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{task.project_name}</td>
                  <td className="px-4 py-2 border">{task.task_name}</td>
                  <td className="px-4 py-2 border">
                    {task.developer_name} <br />
                    <span className="text-sm text-gray-500">
                      {task.developer_email}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-2 border font-medium ${
                      task.task_status === "done"
                        ? "text-green-600"
                        : task.task_status === "in-progress"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {task.task_status}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(task.completion_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewTasks;
