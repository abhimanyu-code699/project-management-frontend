import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import ManagerDashboards from "../components/ManagerDashboards";
import CreateProject from "../components/CreateProject";

const Manager = () => {
  const [showModal, setShowModal] = useState(false);

  const managerName = sessionStorage.getItem("name");

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Project Management</h1>

        <div className="flex items-center space-x-2 cursor-pointer">
          <FaUserCircle className="text-3xl text-gray-600 hover:text-gray-800" />
          <p className="text-gray-700 font-medium">
            {managerName || "Manager"}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">All Projects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            + Create Project
          </button>
        </div>

        <ManagerDashboards />
      </div>
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="cursor-pointer absolute top-6 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <div className="p-6">
              <CreateProject />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
