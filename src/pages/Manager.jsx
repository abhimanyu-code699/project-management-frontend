import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import ManagerDashboards from "../components/ManagerDashboards";
import CreateProject from "../components/CreateProject";
import CreateTask from "../components/CreateTask";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../../utils/urlConfing";

const Manager = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiStories, setAiStories] = useState([]);
  const [loading, setLoading] = useState(false);

  const managerName = sessionStorage.getItem("name");
  const managerId = sessionStorage.getItem("id");
  const navigate = useNavigate();

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setAiStories([]);
    setAiDescription("");
  };

  // 🧠 Handle AI Story Generation
  const handleGenerateStories = async () => {
    if (!aiDescription.trim()) {
      alert("Please enter a project description!");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        `${backend_url}/api/generate-user-stories`,
        { projectDescription: aiDescription },
        { headers: { Authorization: `${token}` } }
      );

      setAiStories(response.data.stories);
    } catch (error) {
      console.error("❌ Error generating user stories:", error);
      alert("Failed to generate stories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Project Management</h1>

        <div className="flex items-center space-x-2 cursor-pointer">
          <FaUserCircle className="text-3xl text-gray-600 hover:text-gray-800" />
          <p className="text-gray-700 font-medium">
            {managerName || "Manager"}
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">All Projects</h2>

          <div className="flex space-x-3">
            <button
              onClick={() => openModal("project")}
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              + Create New Project
            </button>

            <button
              onClick={() => openModal("task")}
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              + Create New Task
            </button>

            <button
              onClick={() => navigate(`/manager/${managerId}/viewtasks`)}
              className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              📋 View All Tasks
            </button>

            {/* ⚡ New AI Button */}
            <button
              onClick={() => openModal("ai")}
              className="bg-orange-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200"
            >
              ⚡ Generate User Stories (AI)
            </button>
          </div>
        </div>

        <ManagerDashboards />
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="cursor-pointer absolute top-6 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <div className="p-6">
              {modalType === "project" && <CreateProject />}
              {modalType === "task" && <CreateTask />}

              {/* 🧠 AI Story Generator Modal */}
              {modalType === "ai" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    🤖 AI-Powered User Story Generator
                  </h2>

                  <label className="block text-gray-700 font-medium mb-1">
                    Project Description
                  </label>
                  <textarea
                    rows="4"
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="Describe your project..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  ></textarea>

                  <button
                    onClick={handleGenerateStories}
                    disabled={loading}
                    className={`mt-3 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Generating..." : "Generate User Stories"}
                  </button>

                  {aiStories.length > 0 && (
                    <div className="mt-5">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        ✨ Generated Stories:
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {aiStories.map((story, index) => (
                          <li key={index} className="text-gray-700">
                            {story}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
