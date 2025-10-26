import axios from "axios";
import React, { useState } from "react";
import { backend_url } from "../../utils/urlConfing";

const CreateProject = ({ onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    assignedTo: "",
    completionDate: "",
    task: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { projectName, assignedTo, completionDate, task } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.post(
        `${backend_url}/api/add-project`,
        {
          project_name: projectName,
          assigned_to: assignedTo,
          task: task,
          completion_date: completionDate,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMessage("✅ Project created successfully!");
        setFormData({
          projectName: "",
          assignedTo: "",
          completionDate: "",
          task: "",
        });

        if (onProjectCreated) onProjectCreated();

        setTimeout(() => {
          if (onClose) onClose();
        }, 1000);
      } else {
        setMessage("⚠️ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage(
        error.response?.data?.message ||
          "❌ Failed to create project. Please check your input."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Create New Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Project Name
          </label>
          <input
            type="text"
            name="projectName"
            value={projectName}
            onChange={handleChange}
            placeholder="Enter project name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Assigned To
          </label>
          <input
            type="text"
            name="assignedTo"
            value={assignedTo}
            onChange={handleChange}
            placeholder="Enter developer name or email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Completion Date
          </label>
          <input
            type="date"
            name="completionDate"
            value={completionDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Task</label>
          <textarea
            name="task"
            value={task}
            onChange={handleChange}
            placeholder="Describe the project tasks or goals"
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            required
          ></textarea>
        </div>

        {message && (
          <p
            className={`text-center font-medium ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium px-6 py-2 rounded-lg transition duration-200`}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
