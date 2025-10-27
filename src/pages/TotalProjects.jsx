import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEdit, FaTrash } from "react-icons/fa";
import { backend_url } from "../../utils/urlConfing";

const TotalProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = sessionStorage.getItem("name");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${backend_url}/admin/getAll-projects-data`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = res.data;

        if (data.success) {
          setProjects(data.data);
        } else {
          setError("Failed to load projects.");
        }
      } catch (error) {
        console.error(error);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 sm:mb-0">
          Project Management
        </h1>
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-4xl text-gray-600 cursor-pointer hover:text-blue-600 transition" />
          <p className="font-medium">{username}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">All Projects</h2>

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="py-3 px-4 border-b">PROJECT NAME</th>
                <th className="py-3 px-4 border-b">MANAGER</th>
                <th className="py-3 px-4 border-b">DEVELOPERS</th>
                <th className="py-3 px-4 border-b">STATUS</th>
                <th className="py-3 px-4 border-b">START DATE</th>
                <th className="py-3 px-4 border-b">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 border-b">
                    {project.project_name}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {project.manager_name || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {project.developers?.length
                      ? project.developers.join(", ")
                      : "No Developers"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        project.status === "done"
                          ? "bg-green-100 text-green-700"
                          : project.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(project.start_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TotalProjects;
