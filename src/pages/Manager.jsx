import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import ManagerDashboards from "../components/ManagerDashboards";
import CreateProject from "../components/CreateProject";
import CreateTask from "../components/CreateTask";
import { useNavigate } from "react-router-dom";

const Manager = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); 

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
            {/* Create Project Button */}
            <button
              onClick={() => openModal("project")}
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              + Create New Project
            </button>

            {/* Create Task Button */}
            <button
              onClick={() => openModal("task")}
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              + Create New Task
            </button>

            {/* View All Tasks Button */}
            <button
              onClick={() => navigate(`/manager/${managerId}/viewtasks`)}
              className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              📋 View All Tasks
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
              {modalType === "project" ? <CreateProject /> : <CreateTask />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
