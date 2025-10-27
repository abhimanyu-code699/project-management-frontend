import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backend_url } from "../../utils/urlConfing";

const CreateProject = () => {
  const [projectData, setProjectData] = useState({
    projectName: "",
    assignedTo: "",
    task: "",
    deadline: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });

    if (name === "assignedTo") {
      fetchDeveloperSuggestions(value);
    }
  };

  // Fetch developer suggestions
  const fetchDeveloperSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${backend_url}/api/get-developers?query=${encodeURIComponent(query)}`
      );
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("❌ Error fetching developer suggestions:", error);
    }
  };

  // Select suggestion
  const handleSelectSuggestion = (dev) => {
    setProjectData({ ...projectData, assignedTo: dev.name });
    setSelectedDeveloperId(dev.id);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !projectData.projectName ||
      !selectedDeveloperId ||
      !projectData.task ||
      !projectData.deadline
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const payload = {
      project_name: projectData.projectName,
      assigned_to: selectedDeveloperId,
      task: projectData.task,
      completion_date: projectData.deadline,
    };

    try {
      setLoading(true);

      const res = await axios.post(`${backend_url}/api/add-project`, payload, {
        headers: { Authorization: `${token}` },
      });

      toast.success(res.data.message || "Project created successfully!");
      setProjectData({
        projectName: "",
        assignedTo: "",
        task: "",
        deadline: "",
      });
      setSelectedDeveloperId(null);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while creating project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        🏗️ Create New Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        {/* Project Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Project Name
          </label>
          <input
            type="text"
            name="projectName"
            value={projectData.projectName}
            onChange={handleChange}
            placeholder="Enter Project Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Task */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Task</label>
          <input
            type="text"
            name="task"
            value={projectData.task}
            onChange={handleChange}
            placeholder="Enter Task Description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assigned To */}
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-1">
            Assigned To
          </label>
          <input
            type="text"
            name="assignedTo"
            value={projectData.assignedTo}
            onChange={handleChange}
            placeholder="Type developer name..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onFocus={() => projectData.assignedTo && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((dev) => (
                <li
                  key={dev.id}
                  onClick={() => handleSelectSuggestion(dev)}
                  className="p-2 hover:bg-blue-100 cursor-pointer text-gray-700"
                >
                  {dev.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Completion Date
          </label>
          <input
            type="date"
            name="deadline"
            value={projectData.deadline}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
