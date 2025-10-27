import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../../utils/urlConfing";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTask = () => {
  const [taskData, setTaskData] = useState({
    projectId: "",
    taskName: "",
    developerId: "",
    developerName: "",
    completionDate: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });

    if (name === "developerName") {
      fetchDeveloperSuggestions(value);
    }
  };

  // 🔹 Fetch developer name suggestions
  const fetchDeveloperSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${backend_url}/api/get-developers?query=${encodeURIComponent(query)}`
      );
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("❌ Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle suggestion selection
  const handleSelectSuggestion = (dev) => {
    setTaskData({
      ...taskData,
      developerName: dev.name,
      developerId: dev.id, // store developer ID for API
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { projectId, taskName, developerId, completionDate } = taskData;

    if (!projectId || !taskName || !developerId || !completionDate) {
      toast.warn("⚠️ Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        `${backend_url}/api/create-task`,
        {
          projectId,
          taskName,
          developerId,
          completion_date: completionDate,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.success(response.data.message || "✅ Task created successfully!");

      // reset form
      setTaskData({
        projectId: "",
        taskName: "",
        developerId: "",
        developerName: "",
        completionDate: "",
      });
    } catch (error) {
      console.error("❌ Error creating task:", error);
      toast.error(
        error.response?.data?.message || "Failed to create task. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={2500} />
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        {/* Project ID */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Project ID
          </label>
          <input
            type="text"
            name="projectId"
            value={taskData.projectId}
            onChange={handleChange}
            placeholder="Enter Project ID"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Task Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Task Name
          </label>
          <input
            type="text"
            name="taskName"
            value={taskData.taskName}
            onChange={handleChange}
            placeholder="Enter Task Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assigned Developer with suggestions */}
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-1">
            Assigned Developer
          </label>
          <input
            type="text"
            name="developerName"
            value={taskData.developerName}
            onChange={handleChange}
            placeholder="Type developer name..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onFocus={() => taskData.developerName && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // smooth close
          />

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {loading ? (
                <li className="p-2 text-gray-500">Loading...</li>
              ) : (
                suggestions.map((dev) => (
                  <li
                    key={dev.id}
                    onClick={() => handleSelectSuggestion(dev)}
                    className="p-2 hover:bg-blue-100 cursor-pointer text-gray-700"
                  >
                    {dev.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Completion Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Completion Date
          </label>
          <input
            type="date"
            name="completionDate"
            value={taskData.completionDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-5 py-2 rounded-lg text-white transition duration-200 ${
              submitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
