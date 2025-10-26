import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { backend_url } from "../../utils/urlConfing";

const ManagerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.get(`${backend_url}/api/get-all-projects`, {
          headers: { Authorization: `${token}` },
        });

        if (response.status === 200) {
          setProjects(response.data.projects);
        } else {
          console.warn("⚠️ Failed to fetch projects");
        }
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleEdit = (projectId) => {
    console.log("Edit project:", projectId);
  };

  const handleDelete = (projectId) => {
    console.log("Delete project:", projectId);
   
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">All Projects</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-6">Loading projects...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="py-3 px-4 border-b w-20 text-center">SI NO</th>
                <th className="py-3 px-4 border-b">PROJECT ID</th>
                <th className="py-3 px-4 border-b">PROJECT NAME</th>
                <th className="py-3 px-4 border-b">ASSIGNED DEVELOPERS</th>
                <th className="py-3 px-4 border-b">START DATE</th>
                <th className="py-3 px-4 border-b">COMPLETION DATE</th>
                <th className="py-3 px-4 border-b">STATUS</th>
                <th className="py-3 px-4 border-b text-center">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={project.project_id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-center">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border-b">{project.project_id}</td>
                    <td className="py-3 px-4 border-b">{project.project_name}</td>
                    <td className="py-3 px-4 border-b">
                      {project.assigned_developers
                        ?.map((dev) => dev.developer_name)
                        .join(", ") || "—"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {project.start_date?.split(" ")[0] || "—"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {project.completion_date || "—"}
                    </td>
                    <td className="py-3 px-4 border-b capitalize">
                      {project.status}
                    </td>
                    <td className="py-3 px-4 border-b text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(project.project_id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(project.project_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center text-gray-500 py-4 border-b"
                  >
                    No projects assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
